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
        "patients.sql",
        "doctors.sql",
        "admins.sql",
        "health_officials.sql",
        "immigration_officers.sql",
    ];
    const files = schemas.map((schema) => `${baseDir}/${schema}`);

    const client = await pool.connect();

    await client.query("BEGIN");

    for (const file of files) {
        const sql = readFileSync(file).toString();
        const res = await client.query(sql);
        console.log(res);
    }

    await client.query("COMMIT");

    client.release();
})();
