import "dotenv/config";
import { Pool } from "pg";

(async () => {
    const tables = ["addresses", "users", "patients", "doctors", "admins", "health_officials", "immigration_officers"];

    const pool = new Pool();

    for (const table of tables) {
        const sql = `
            TRUNCATE ${table} RESTART IDENTITY CASCADE;
        `;
        await pool.query(sql);
    }

    await pool.end();

    console.log("Finished restoring database...");
})();
