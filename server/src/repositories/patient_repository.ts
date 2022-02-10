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

    async assignDoctor(patientId: number, doctorId: number): Promise<void> {
        const client = await this.pool.connect();

        await client.query("BEGIN;");

        await client.query(
            `UPDATE patients
                            SET doctor_id = ($1) 
                            WHERE patient_id = ($2);`,
            [doctorId, patientId],
        );

        await client.query("COMMIT;");
        client.release();
    }
}
