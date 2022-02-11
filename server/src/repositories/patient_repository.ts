import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { Pool } from "pg";
import { Role } from "../entities/role";
import { UserRepository } from "./user_repository";

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
}
