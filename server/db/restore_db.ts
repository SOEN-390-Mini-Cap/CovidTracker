import "dotenv/config";
import { Pool } from "pg";
import { SCHEMAS } from "./schemas";

export async function restoreDb(): Promise<void> {
    const [, ...tables] = SCHEMAS;

    const pool = new Pool();

    for (const table of tables) {
        const sql = `
            TRUNCATE ${table} RESTART IDENTITY CASCADE;
        `;
        await pool.query(sql);
    }

    await pool.end();
}
