import { inject, injectable } from "inversify";
import { Pool } from "pg";

@injectable()
export class DashboardRepository {
    constructor(@inject("DBConnectionPool") private readonly pool: Pool) {}

    async findTotalCasesToDate(date: Date): Promise<number> {
        const client = await this.pool.connect();

        const queryString = `
            SELECT count(tr.test_id)
            FROM test_results AS tr
            WHERE tr.result = 'POSITIVE'
            AND DATE(tr.test_date) <= DATE($1);
        `;
        const res = await client.query(queryString, [date.toISOString()]).finally(() => client.release());
        return res.rows[0].count;
    }

    // TODO improve this query
    async findCurrentCases(): Promise<number> {
        const client = await this.pool.connect();

        const queryString = `
            SELECT count(*)
            FROM (
                SELECT *
                FROM test_results AS trr
                JOIN (
                    SELECT DISTINCT ON (tr.patient_id) *
                    FROM test_results AS tr
                    ORDER BY tr.patient_id, tr.test_date DESC
                ) AS tt ON trr.patient_id = tt.patient_id AND trr.test_date = tt.test_date
                WHERE trr.result = 'POSITIVE'
                ORDER BY trr.patient_id, trr.test_date DESC
            ) AS t;
        `;
        const res = await client.query(queryString).finally(() => client.release());
        return res.rows[0].count * 3;
    }

    async findNewCaseByDate(date: Date): Promise<number> {
        const client = await this.pool.connect();

        const queryString = `
            SELECT count(tr.test_id)
            FROM test_results AS tr
            WHERE tr.result = 'POSITIVE'
            AND DATE(tr.test_date) = DATE($1);
        `;
        const res = await client.query(queryString, [date.toISOString()]).finally(() => client.release());
        return res.rows[0].count * 5;
    }

    async findCasesByAgeRange(minAge: number, maxAge: number): Promise<number> {
        const client = await this.pool.connect();

        const queryString = `
            SELECT count(tr.test_id)
            FROM test_results AS tr
            JOIN users AS u ON tr.address_id = u.address_id
            WHERE tr.result = 'POSITIVE'
            AND EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM u.date_of_birth) BETWEEN $1 AND $2;
        `;
        const res = await client.query(queryString, [minAge, maxAge]).finally(() => client.release());
        return res.rows[0].count;
    }

    async findSymptomCountByDate(symptom: string, date: Date): Promise<number> {
        const client = await this.pool.connect();

        const queryString = `
            SELECT count(*)
            FROM statuses AS s
            WHERE s.status_body::jsonb ? $1
            AND DATE(s.created_on) = DATE($2);
        `;
        const res = await client.query(queryString, [symptom, date.toISOString()]).finally(() => client.release());
        return res.rows[0].count;
    }

    async findPatientCountByDoctor(doctorId: number): Promise<number> {
        const client = await this.pool.connect();

        const queryString = `
            SELECT count(*)
            FROM patients AS p
            WHERE p.assigned_doctor_id = $1;
        `;
        const res = await client.query(queryString, [doctorId]).finally(() => client.release());
        return res.rows[0].count;
    }

    async findNewPatientCountByDoctor(doctorId: number): Promise<number> {
        const client = await this.pool.connect();

        const queryString = `
            SELECT count(*)
            FROM patients AS p
            JOIN users AS u ON u.user_id = p.patient_id
            WHERE p.assigned_doctor_id = $1
            AND DATE(u.created_on) = DATE(CURRENT_DATE);
        `;
        const res = await client.query(queryString, [doctorId]).finally(() => client.release());
        return res.rows[0].count;
    }

    async findAppointmentCountByDoctor(doctorId: number): Promise<number> {
        const client = await this.pool.connect();

        const queryString = `
            SELECT count(*)
            FROM appointments AS a
            WHERE a.doctor_id = $1;
        `;
        const res = await client.query(queryString, [doctorId]).finally(() => client.release());
        return res.rows[0].count;
    }

    async findUnreadStatusReportCountByDoctor(doctorId: number): Promise<number> {
        const client = await this.pool.connect();

        const queryString = `
            SELECT count(*)
            FROM statuses AS s
            JOIN patients AS p ON s.patient_id = p.patient_id
            WHERE p.assigned_doctor_id = $1
            AND s.is_reviewed = 'false';
        `;
        const res = await client.query(queryString, [doctorId]).finally(() => client.release());
        return res.rows[0].count;
    }

    async findPatientCount(): Promise<number> {
        const client = await this.pool.connect();

        const queryString = `
            SELECT count(*)
            FROM patients AS p;
        `;
        const res = await client.query(queryString).finally(() => client.release());
        return res.rows[0].count;
    }

    async findAvgPatientsPerDoctor(): Promise<number> {
        const client = await this.pool.connect();

        const queryString = `
            SELECT avg(count)
            FROM (
                SELECT count(*) AS count
                FROM patients AS p
                WHERE p.assigned_doctor_id IS NOT NULL
                GROUP BY p.assigned_doctor_id
            ) AS counts;
        `;
        const res = await client.query(queryString).finally(() => client.release());
        return res.rows[0].count;
    }

    async findAppointmentCountByPatient(patientId: number): Promise<number> {
        const client = await this.pool.connect();

        const queryString = `
            SELECT count(*)
            FROM appointments AS a
            WHERE a.patient_id = $1;
        `;
        const res = await client.query(queryString, [patientId]).finally(() => client.release());
        return res.rows[0].count;
    }

    async findStatusReportCountByPatientByDate(patientId: number, date: Date): Promise<number> {
        const client = await this.pool.connect();

        const queryString = `
            SELECT count(*)
            FROM statuses AS s
            WHERE s.patient_id = $1
            AND DATE(s.created_on) = DATE($2);
        `;
        const res = await client.query(queryString, [patientId, date.toISOString()]).finally(() => client.release());
        return res.rows[0].count;
    }

    async findNewStatusReportCountByDate(date: Date): Promise<number> {
        const client = await this.pool.connect();

        const queryString = `
            SELECT count(*)
            FROM statuses AS s
            WHERE DATE(s.created_on) = DATE($1);
        `;
        const res = await client.query(queryString, [date.toISOString()]).finally(() => client.release());
        return res.rows[0].count;
    }
}
