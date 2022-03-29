import { inject, injectable } from "inversify";
import { Pool } from "pg";

@injectable()
export class DashboardRepository {
    constructor(@inject("DBConnectionPool") private readonly pool: Pool) {}

    async findTotalCases(): Promise<number> {
        const client = await this.pool.connect();

        const queryString = `
            SELECT count(tr.test_id)
            FROM test_results AS tr
            WHERE tr.result = 'POSITIVE';
        `;
        const res = await client.query(queryString).finally(() => client.release());
        return res.rows[0].count;
    }

    async findCurrentCases(): Promise<number> {
        const client = await this.pool.connect();

        const queryString = `
            SELECT count(tr.test_id)
            FROM test_results AS tr
            WHERE tr.result = 'POSITIVE';
        `;
        const res = await client.query(queryString).finally(() => client.release());
        return res.rows[0].count;
    }

    async findNewCasesToday(): Promise<number> {
        const client = await this.pool.connect();

        const queryString = `
            SELECT count(tr.test_id)
            FROM test_results AS tr
            WHERE tr.result = 'POSITIVE';
        `;
        const res = await client.query(queryString).finally(() => client.release());
        return res.rows[0].count;
    }
}
