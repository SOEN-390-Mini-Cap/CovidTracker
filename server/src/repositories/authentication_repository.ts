import "reflect-metadata";
import { inject, injectable } from "inversify";
import { Pool } from "pg";
import {User} from "../entities/user";

@injectable()
export class AuthenticationRepository {
    constructor(@inject("DBConnectionPool") private readonly pool: Pool) {}

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

    async getUserByEmail(email: string): Promise<User> {
        const client = await this.pool.connect();

        const res = await client.query(
            `SELECT user_id, email, first_name, last_name, date_of_birth, created_on, password FROM users WHERE email='${email}'`,
        );

        client.release();

        return this.buildUser(res.rows[0]);
    }

    private buildUser(row: any): User {
        return {
            userId: row.user_id,
            email: row.email,
            firstName: row.first_name,
            lastName: row.last_name,
            dateOfBirth: row.date_of_birth,
            password: row.password,
        };
    }
}
