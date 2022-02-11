import "reflect-metadata";
import { inject, injectable } from "inversify";
import { Pool } from "pg";
import { StatusFields } from "../entities/status_fields";

@injectable()
export class StatusRepository {
    constructor(@inject("DBConnectionPool") private readonly pool: Pool) {}

    async updatePatientStatusFields(patientId: number, fields: StatusFields): Promise<void> {
        const client = await this.pool.connect();

        const sql = `
            UPDATE patients
            SET status_fields = $1
            WHERE patients.patient_id = $2;
        `;
        await client.query(sql, [JSON.stringify(fields), patientId]).finally(() => client.release());
    }

    async findStatusFieldsByPatientId(patientId: number): Promise<StatusFields> {
        const client = await this.pool.connect();

        const sql = `
            SELECT status_fields
            FROM patients
            WHERE patient_id = $1;
        `;
        const res = await client.query(sql, [patientId]).finally(() => client.release());
        return res.rows[0]?.status_fields;
    }
}
