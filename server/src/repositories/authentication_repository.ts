import "reflect-metadata";
import { inject, injectable } from "inversify";
import { Pool } from "pg";
import { User } from "../entities/user";

@injectable()
export class AuthenticationRepository {
    constructor(@inject("DBConnectionPool") private readonly pool: Pool) {}

    async createUser(user: User): Promise<string> {
        const client = await this.pool.connect();

        const sql = `
            INSERT INTO users (
                email,
                password,
                first_name, 
                last_name,
                date_of_birth
            ) VALUES (
                '${user.email}',
                '${user.password}',
                '${user.firstName}',
                '${user.lastName}',
                '${user.dateOfBirth.toISOString()}'
            ) RETURNING user_id
        `;
        const res = await client.query(sql).finally(async () => client.release());

        return res.rows[0].user_id;
    }

    async getUserByEmail(email: string): Promise<User> {
        const client = await this.pool.connect();

        const sql = `
            SELECT 
                   user_id,
                   email,
                   first_name,
                   last_name,
                   date_of_birth,
                   created_on,
                   password 
            FROM users WHERE email='${email}'
        `;
        const res = await client.query(sql).finally(async () => client.release());

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
