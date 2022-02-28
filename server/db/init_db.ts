import "dotenv/config";
import { Pool } from "pg";
import { readFileSync } from "fs";

(async () => {
    const pool = new Pool();

    const baseDir = `${__dirname}/schemas`;
    const schemas = [
        "roles.sql",
        "addresses.sql",
        "users.sql",
        "doctors.sql",
        "patients.sql",
        "admins.sql",
        "health_officials.sql",
        "immigration_officers.sql",
        "statuses.sql",
        "test_results.sql",
    ];
    const files = schemas.map((schema) => `${baseDir}/${schema}`);

    await pool.query("BEGIN;");

    for (const file of files) {
        const sql = readFileSync(file).toString();
        await pool.query(sql);
    }

    await pool.query("COMMIT;");

    await pool.end();

    console.log("Finished initializing database...");
})();
