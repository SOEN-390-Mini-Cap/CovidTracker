import "reflect-metadata";
import { injectable } from "inversify";
import { Pool } from "pg";
@injectable()
export class AuthenticationRepository {
    async createUser(email: string, hash: string, first_name: string, last_name: string, date_of_birth: Date) {
        const pool = new Pool();
        const client = await pool.connect();

        try {
            client.query("BEGIN");
            const sql = `INSERT INTO users (email, password, first_name, last_name, date_of_birth)
            VALUES ('${email}', '${hash}', '${first_name}', '${last_name}', '${date_of_birth}')`;

            await client.query(sql);

            await client.query("COMMIT");
            client.release();
        } catch (e) {
            return e;
        }
        return;
    }
}
