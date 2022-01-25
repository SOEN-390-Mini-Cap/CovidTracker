import "reflect-metadata";
import { inject, injectable } from "inversify";
import { Pool, QueryResult } from "pg";
import { User } from "../entities/user";
import { UserReqData } from "../controllers/authentication_controller";

@injectable()
export class UserRepository {
    constructor(@inject("DBConnectionPool") private readonly pool: Pool) {}

    async add(userData: UserReqData): Promise<string> {
        const client = await this.pool.connect();

        const sql = `
            INSERT INTO users (
                email,
                password,
                first_name, 
                last_name,
                phone_number,
                gender,
                date_of_birth
            ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id
        `;

        const res = await client
            .query(sql, [
                userData.email,
                userData.password,
                userData.firstName,
                userData.lastName,
                userData.phoneNumber,
                userData.gender,
                userData.dateOfBirth.toISOString(),
            ])
            .finally(async () => client.release());
        return res.rows[0].user_id;
    }

    async findByEmail(email: string): Promise<User> {
        const client = await this.pool.connect();

        const sql = "SELECT * FROM users WHERE email=$1";
        const res = await client.query(sql, [email]).finally(async () => client.release());

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
            password: rawUser.password,
            firstName: rawUser.first_name,
            lastName: rawUser.last_name,
            phoneNumber: rawUser.phoneNumber,
            gender: rawUser.gender,
            dateOfBirth: rawUser.date_of_birth,
            createdOn: rawUser.created_on,
        };
    }
}
