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

    async findPatientsFiltered(testResult: TestResultType, testDateFrom: Date, testDateTo: Date): Promise<User[]> {
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
            Join test_results As tr On tr.patient_id = p.patient_id
            WHERE tr.result = $1 AND
                  tr.testDate >= $2 AND
                  tr.testDate <= $3
            ORDER BY u.is_prioritized DESC;
        `;

        const res = await client.query(sql, [testResult, testDateFrom, testDateTo]).finally(() => client.release());
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
            WHERE p.assigned_doctor_id = $1
                  tr.result = $2 AND
                  tr.testDate >= $3 AND
                  tr.testDate <= $4
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
