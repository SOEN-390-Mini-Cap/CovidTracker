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
        return res.rows[0].count;
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
        return res.rows[0].count;
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
}
