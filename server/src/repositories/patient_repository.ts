import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { Pool, QueryResult } from "pg";
import { Role } from "../entities/role";
import { UserRepository } from "./user_repository";
import { PatientCount } from "../entities/patient_counts";
import { User } from "../entities/user";
import { TestResultType } from "../entities/test_result_type";

@injectable()
export class PatientRepository {
    constructor(
        @inject("DBConnectionPool") private readonly pool: Pool,
        @inject("Repository")
        @named("UserRepository")
        private readonly userRepository: UserRepository,
    ) {}

    async addPatient(userId: number): Promise<void> {
        const client = await this.pool.connect();

        await client.query("BEGIN;");

        await this.userRepository.updateUserRoleHelper(client, userId, Role.PATIENT);

        await client.query(`INSERT INTO patients (patient_id) VALUES ($1);`, [userId]);

        await client.query("COMMIT;");
        client.release();
    }

    async updateAssignedDoctor(patientId: number, doctorId: number): Promise<void> {
        const client = await this.pool.connect();

        await client.query(
            `UPDATE patients
                            SET assigned_doctor_id = ($1) 
                            WHERE patient_id = ($2);`,
            [doctorId, patientId],
        );

        client.release();
    }

    async updatePatientPrioritized(patientId: number, isPrioritized: boolean): Promise<void> {
        const client = await this.pool.connect();

        const sql = `
            UPDATE users as u
            SET is_prioritized = ($1)
            WHERE u.user_id = ($2);
        `;

        await client.query(sql, [isPrioritized, patientId]).finally(() => client.release());
    }

    async findAssignedDoctorId(patientId: number): Promise<number> {
        const client = await this.pool.connect();

        const sql = `
            SELECT assigned_doctor_id
            FROM patients
            WHERE patient_id = $1
        `;

        const res = await client.query(sql, [patientId]).finally(() => client.release());
        return res.rows[0]?.assigned_doctor_id;
    }

    async findPatientCounts(): Promise<PatientCount[]> {
        const client = await this.pool.connect();

        const sql = `
            SELECT user_id, first_name, last_name, email, count(*)
            FROM patients
            JOIN users on assigned_doctor_id = user_id
            GROUP BY user_id;
        `;

        const res = await client.query(sql).finally(() => client.release());
        return this.buildPatientCounts(res);
    }

    async findPatients(): Promise<User[]> {
        const client = await this.pool.connect();

        const sql = `
            SELECT
                u.user_id,
                u.email,
                u.password,
                u.first_name,
                u.last_name,
                u.phone_number,
                u.gender,
                u.date_of_birth,
                u.created_on,
                u.is_prioritized,
                r.role_name,
                a.address_id,
                a.street_address,
                a.street_address_line_two,
                a.city,
                a.province,
                a.postal_code,
                a.country
            FROM users AS u
            JOIN patients AS p ON u.user_id = p.patient_id
            JOIN roles AS r ON u.role_id = r.role_id
            JOIN addresses AS a ON u.address_id = a.address_id
            ORDER BY u.is_prioritized DESC;
        `;

        const res = await client.query(sql).finally(() => client.release());
        return this.userRepository.buildUsers(res);
    }

    async findPatientsFilteredByStatus(
        testResult: TestResultType,
        testDateFrom: Date,
        testDateTo: Date,
    ): Promise<User[]> {
        const client = await this.pool.connect();

        const sql = `
            SELECT
                u.user_id,
                u.email,
                u.password,
                u.first_name,
                u.last_name,
                u.phone_number,
                u.gender,
                u.date_of_birth,
                u.created_on,
                u.is_prioritized,
                r.role_name,
                a.address_id,
                a.street_address,
                a.street_address_line_two,
                a.city,
                a.province,
                a.postal_code,
                a.country,
                tr.test_date
            FROM users AS u
            JOIN patients AS p ON u.user_id = p.patient_id
            JOIN roles AS r ON u.role_id = r.role_id
            JOIN addresses AS a ON u.address_id = a.address_id
            Join (SELECT DISTINCT ON (tr.patient_id)
                tr.test_id,
                tr.patient_id,
                tr.result,
                tr.test_type,
                tr.test_date,
                tr.address_id
                FROM test_results as tr
                WHERE tr.test_date >= $2
                AND tr.test_date <= $3
                order by patient_id, test_date desc
            ) As tr On tr.patient_id = p.patient_id
            WHERE tr.result = $1
            ORDER BY u.is_prioritized DESC;
        `;

        const res = await client.query(sql, [testResult, testDateFrom, testDateTo]).finally(() => client.release());
        return this.userRepository.buildUsers(res);
    }

    async findPatientsFilteredByTraceTarget(
        traceTarget: number,
        testDateFrom: Date,
        testDateTo: Date,
    ): Promise<User[]> {
        const client = await this.pool.connect();

        const sql = `
            SELECT DISTINCT ON (u.user_id)
                u.user_id,
                u.email,
                u.password,
                u.first_name,
                u.last_name,
                u.phone_number,
                u.gender,
                u.date_of_birth,
                u.created_on,
                u.is_prioritized,
                r.role_name,
                a.address_id,
                a.street_address,
                a.street_address_line_two,
                a.city,
                a.province,
                a.postal_code,
                a.country,
                lr.created_on AS contact_date
            FROM users AS u
            JOIN roles AS r ON u.role_id = r.role_id
            JOIN addresses AS a ON u.address_id = a.address_id
            JOIN (
                SELECT lr.user_id, lr.created_on
                FROM location_reports as lr
                WHERE (address_id, DATE(created_on)) in
                    (
                        SELECT address_id, DATE(created_on)
                        FROM location_reports as lr
                        WHERE lr.user_id = $1
                        AND lr.created_on > $2
                        AND lr.created_on <= $3
                    )
                AND lr.user_id <> $1
            ) AS lr ON lr.user_id = u.user_id;
        `;

        const res = await client.query(sql, [traceTarget, testDateFrom, testDateTo]).finally(() => client.release());
        return this.userRepository.buildUsers(res);
    }

    async findPatientsAssignedToDoctor(doctorId: number): Promise<User[]> {
        const client = await this.pool.connect();

        const sql = `
            SELECT
                u.user_id,
                u.email,
                u.password,
                u.first_name,
                u.last_name,
                u.phone_number,
                u.gender,
                u.date_of_birth,
                u.created_on,
                u.is_prioritized,
                r.role_name,
                a.address_id,
                a.street_address,
                a.street_address_line_two,
                a.city,
                a.province,
                a.postal_code,
                a.country
            FROM users AS u
            JOIN patients AS p ON u.user_id = p.patient_id
            JOIN roles AS r ON u.role_id = r.role_id
            JOIN addresses AS a ON u.address_id = a.address_id
            WHERE p.assigned_doctor_id = $1
            ORDER BY u.is_prioritized DESC;
        `;

        const res = await client.query(sql, [doctorId]).finally(() => client.release());
        return this.userRepository.buildUsers(res);
    }

    async findPatientsAssignedToDoctorFiltered(
        doctorId: number,
        testResult: TestResultType,
        testDateFrom: Date,
        testDateTo: Date,
    ): Promise<User[]> {
        const client = await this.pool.connect();

        const sql = `
            SELECT
                u.user_id,
                u.email,
                u.password,
                u.first_name,
                u.last_name,
                u.phone_number,
                u.gender,
                u.date_of_birth,
                u.created_on,
                u.is_prioritized,
                r.role_name,
                a.address_id,
                a.street_address,
                a.street_address_line_two,
                a.city,
                a.province,
                a.postal_code,
                a.country
            FROM users AS u
                     JOIN patients AS p ON u.user_id = p.patient_id
                     JOIN roles AS r ON u.role_id = r.role_id
                     JOIN addresses AS a ON u.address_id = a.address_id
                     Join (SELECT DISTINCT ON (tr.patient_id)
                tr.test_id,
                tr.patient_id,
                tr.result,
                tr.test_type,
                tr.test_date,
                tr.address_id
                FROM test_results as tr
                WHERE tr.test_date >= $3 AND
                      tr.test_date <= $4
                order by patient_id, test_date desc) As tr On tr.patient_id = p.patient_id
            WHERE p.assigned_doctor_id = $1 AND
                tr.result = $2
            ORDER BY u.is_prioritized DESC;
        `;

        const res = await client
            .query(sql, [doctorId, testResult, testDateFrom, testDateTo])
            .finally(() => client.release());
        return this.userRepository.buildUsers(res);
    }

    private buildPatientCounts({ rows }: QueryResult): PatientCount[] {
        return rows.map((row) => ({
            doctorId: row.user_id,
            doctorName: `${row.first_name} ${row.last_name}`,
            doctorEmail: row.email,
            numberOfPatients: +row.count,
        }));
    }
}
