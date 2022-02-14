import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { Pool, QueryResult } from "pg";
import { Role } from "../entities/role";
import { UserRepository } from "./user_repository";
import { PatientCount } from "../entities/patient_counts";

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

    private buildPatientCounts({ rows }: QueryResult): PatientCount[] {
        return rows.map((row) => ({
            doctorId: row.user_id,
            doctorName: `${row.first_name} ${row.last_name}`,
            doctorEmail: row.email,
            numberOfPatients: +row.count,
        }));
    }
}
