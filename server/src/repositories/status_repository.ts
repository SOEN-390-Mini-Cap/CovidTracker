import "reflect-metadata";
import { inject, injectable } from "inversify";
import { Pool, QueryResult } from "pg";
import { StatusFields } from "../entities/status_fields";
import { Status } from "../entities/status";

@injectable()
export class StatusRepository {
    constructor(@inject("DBConnectionPool") private readonly pool: Pool) {}

    async findStatusesByDoctor(doctorId: number): Promise<Status[]> {
        const client = await this.pool.connect();

        const sql = `
            SELECT
                s.status_id,
                s.patient_id,
                s.status_body,
                s.is_reviewed,
                s.created_on
            FROM statuses AS s
            JOIN patients AS p ON p.patient_id = s.patient_id
            WHERE p.assigned_doctor_id = $1
            ORDER BY s.created_on DESC;
        `;
        const res = await client.query(sql, [doctorId]).finally(() => client.release());
        return this.buildStatuses(res);
    }

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

    async insertStatus(status: Status): Promise<void> {
        const client = await this.pool.connect();

        const sql = `
            INSERT INTO statuses (
                patient_id,
                status_body,
                is_reviewed,
                created_on
            )
            VALUES ($1, $2, $3, $4);
        `;
        await client
            .query(sql, [
                status.patientId,
                JSON.stringify(status.statusBody),
                status.isReviewed,
                status.createdOn.toISOString(),
            ])
            .finally(() => client.release());
    }

    async findStatus(statusId: number): Promise<Status> {
        const client = await this.pool.connect();

        const sql = `
            SELECT
                s.status_id,
                s.patient_id,
                s.status_body,
                s.is_reviewed,
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
                s.status_body,
                s.is_reviewed,
                s.created_on
            FROM statuses AS s
            WHERE s.patient_id = $1
            ORDER BY s.created_on DESC;
        `;
        const res = await client.query(sql, [patientId]).finally(() => client.release());
        return this.buildStatuses(res);
    }

    async updateStatusReviewed(statusId: number, isReviewed: boolean): Promise<void> {
        const client = await this.pool.connect();

        const sql = `
            UPDATE statuses as s
            SET is_reviewed = ($1)
            WHERE s.status_id = ($2);
        `;
        await client.query(sql, [isReviewed, statusId]).finally(() => client.release());
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
            isReviewed: row.is_reviewed,
            createdOn: new Date(row.created_on),
            statusBody: row.status_body,
        };
    }
}
