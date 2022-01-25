import "reflect-metadata";
import { inject, injectable } from "inversify";
import { Pool } from "pg";
import { User } from "../entities/user";
import { Gender } from "../entities/gender";
import { Role } from "../entities/role";
import { DatabaseUser } from "../entities/database/DatabaseUser";
import { RequestUser } from "../entities/request/RequestUser";

@injectable()
export class UserRepository {
    constructor(@inject("DBConnectionPool") private readonly pool: Pool) {}

    async add(userData: RequestUser): Promise<string> {
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
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING user_id
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

        const sql = `
            SELECT
                users.user_id,
                email,
                password,
                first_name,
                last_name,
                phone_number,
                gender,
                date_of_birth,
                created_on,
                role_name
            FROM users
            INNER JOIN user_roles ON users.user_id = user_roles.user_id
            INNER JOIN roles on user_roles.role_id = roles.role_id
            WHERE users.email = $1
        `;
        const { rows } = await client.query<DatabaseUser>(sql, [email]).finally(async () => client.release());

        return this.buildUser(rows);
    }

    private buildUser(rows: DatabaseUser[]): User {
        if (!rows) {
            return null;
        }

        const firstRow = rows[0];
        const roles: Role[] = rows.map((row) => Role[row.role_name]);

        return {
            userId: firstRow.user_id,
            email: firstRow.email,
            password: firstRow.password,
            firstName: firstRow.first_name,
            lastName: firstRow.last_name,
            phoneNumber: firstRow.phone_number,
            gender: Gender[firstRow.gender],
            dateOfBirth: new Date(firstRow.date_of_birth),
            createdOn: new Date(firstRow.created_on),
            roles,
        };
    }
}
