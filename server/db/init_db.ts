import "dotenv/config";
import { Pool } from "pg";
import { readFileSync } from "fs";
import { schemas } from "./schemas";

(async () => {
    const pool = new Pool();

    const baseDir = `${__dirname}/schemas`;
    const files = schemas.map((schema) => `${baseDir}/${schema}.sql`);

    await pool.query("BEGIN;");

    for (const file of files) {
        const sql = readFileSync(file).toString();
        await pool.query(sql);
    }

    await pool.query("COMMIT;");

    await pool.end();

    console.log("Finished initializing database...");
})();
