import "reflect-metadata";
import { inject, injectable } from "inversify";
import { Pool, QueryResult } from "pg";
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

        return this.buildUser(res);
    }

    private buildUser(res: QueryResult<any>): User {
        const rawUser = res.rows[0];

        if (!rawUser) {
            return null;
        }

        return {
            userId: rawUser.user_id,
            email: rawUser.email,
            firstName: rawUser.first_name,
            lastName: rawUser.last_name,
            dateOfBirth: rawUser.date_of_birth,
            password: rawUser.password,
        };
    }
}
