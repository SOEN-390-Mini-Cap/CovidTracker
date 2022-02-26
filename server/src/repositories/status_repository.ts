import "reflect-metadata";
import { inject, injectable } from "inversify";
import { Pool, QueryResult } from "pg";
import { StatusFields } from "../entities/status_fields";
import { Status, StatusBody } from "../entities/status";

@injectable()
export class StatusRepository {
    constructor(@inject("DBConnectionPool") private readonly pool: Pool) {}

    async updateStatusFields(patientId: number, fields: StatusFields): Promise<void> {
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

    async insertStatus(patientId: number, status: StatusBody): Promise<void> {
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

    async findLatestStatus(patientId: number): Promise<Status> {
        const client = await this.pool.connect();

        const sql = `
            SELECT
                s.status_id,
                s.patient_id,
                s.status,
                s.created_on
            FROM statuses AS s
            WHERE s.patient_id = $1
            ORDER BY s.created_on DESC
            LIMIT 1;
        `;
        const res = await client.query(sql, [patientId]).finally(() => client.release());
        return this.buildStatus(res.rows[0]);
    }

    async findStatus(statusId: number): Promise<Status> {
        const client = await this.pool.connect();

        const sql = `
            SELECT
                s.status_id,
                s.patient_id,
                s.status,
                s.created_on
            FROM statuses AS s
            WHERE s.status_id = $1;
        `;
        const res = await client.query(sql, [statusId]).finally(() => client.release());
        return this.buildStatus(res.rows[0]);
    }

    async findStatusesForPatient(patientId: number): Promise<Status[]> {
        const client = await this.pool.connect();

        const sql = `
            SELECT
                s.status_id,
                s.patient_id,
                s.status,
                s.created_on
            FROM statuses AS s
            WHERE s.patient_id = $1
            ORDER BY s.created_on DESC;
        `;
        const res = await client.query(sql, [patientId]).finally(() => client.release());
        return this.buildStatuses(res);
    }

    private buildStatuses({ rows }: QueryResult): Status[] {
        return rows.map(this.buildStatus);
    }

    private buildStatus(row: any): Status {
        if (!row) {
            return null;
        }

        return {
            statusId: row.status_id,
            patientId: row.patient_id,
            createdOn: new Date(row.created_on),
            status: row.status,
        };
    }
}
