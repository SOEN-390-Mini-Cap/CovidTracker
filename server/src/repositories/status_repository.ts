import "reflect-metadata";
import { inject, injectable } from "inversify";
import {Pool, QueryResult} from "pg";
import { StatusFields } from "../entities/status_fields";
import {Status} from "../entities/status";
import {PatientStatus} from "../entities/patient_status";

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

    async findStatusFields(patientId: number): Promise<StatusFields> {
        const client = await this.pool.connect();

        const sql = `
            SELECT status_fields
            FROM patients
            WHERE patient_id = $1;
        `;
        const res = await client.query(sql, [patientId]).finally(() => client.release());
        return res.rows[0]?.status_fields;
    }

    async addStatus(patientId: number, status: Status): Promise<void> {
        const client = await this.pool.connect();

        const sql = `
            INSERT INTO statuses (
                patient_id,
                status
            )
            VALUES ($1, $2);
        `;
        await client.query(sql, [patientId, JSON.stringify(status)]).finally(() => client.release());
    }

    async findLatestStatus(patientId: number): Promise<PatientStatus> {
        const client = await this.pool.connect();

        const sql = `
            SELECT
                s.status_id,
                s.patient_id
                s.status,
                s.created_on
            FROM statuses AS s
            WHERE s.patient_id = $1
            ORDER BY s.created_on DESC
            LIMIT 1;
        `;
        const res = await client.query(sql, [patientId]).finally(() => client.release());
        return this.buildStatus(res);
    }

    private buildStatus({ rows }: QueryResult): PatientStatus {
        if (rows.length == 0) {
            return null;
        }

        const row = rows[0];
        return {
            statusId: row.status_id,
            patientId: row.patient_id,
            createdOn: new Date(row.created_on),
            status: row.status,
        };
    }
}
