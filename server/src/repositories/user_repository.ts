import "reflect-metadata";
import { inject, injectable } from "inversify";
import { Pool, QueryResult } from "pg";
import { User } from "../entities/user";
import { Gender } from "../entities/gender";
import { Role } from "../entities/role";
import { RequestUser } from "../entities/request/RequestUser";
import { RequestAddress } from "../entities/request/RequestAddress";

@injectable()
export class UserRepository {
    private static readonly defaultRoleId = 1;

    constructor(@inject("DBConnectionPool") private readonly pool: Pool) {}

    async addUser(userData: RequestUser, addressId: number): Promise<number> {
        const client = await this.pool.connect();

        const sql = `
            INSERT INTO users (
                email,
                password,
                first_name, 
                last_name,
                phone_number,
                gender,
                date_of_birth,
                address_id,
                role_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING user_id;
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
                addressId,
                UserRepository.defaultRoleId,
            ])
            .finally(async () => client.release());

        return res.rows[0].user_id;
    }

    async findUserByEmail(email: string): Promise<User> {
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
                role_name,
                users.address_id,
                street_address,
                street_address_line_two,
                city,
                province,
                postal_code,
                country
            FROM users, roles, addresses
            WHERE users.role_id = roles.role_id
              AND users.address_id = addresses.address_id
              AND users.email = $1;
        `;
        const res = await client.query(sql, [email]).finally(async () => client.release());

        return this.buildUser(res);
    }

    async findUserByUserId(userId: number): Promise<User> {
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
                role_name,
                users.address_id,
                street_address,
                street_address_line_two,
                city,
                province,
                postal_code,
                country
            FROM users, roles, addresses
            WHERE users.role_id = roles.role_id
              AND users.address_id = addresses.address_id
              AND users.user_id = $1;
        `;
        const res = await client.query(sql, [userId]).finally(async () => client.release());

        return this.buildUser(res);
    }

    async addAddress(addressData: RequestAddress): Promise<number> {
        const client = await this.pool.connect();

        // This statement will insert if the unique constraint between all
        // values is satisfied else it will do nothing, either way it
        // will return the address_id
        const sql = `
            INSERT INTO addresses (
                street_address,
                street_address_line_two,
                city,
                province,
                postal_code,
                country
            ) VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (
                street_address,
                street_address_line_two,
                city,
                province,
                postal_code,
                country
            ) DO UPDATE SET
                street_address = $1,
                street_address_line_two = $2,
                city = $3,
                province = $4,
                postal_code = $5,
                country = $6
            RETURNING address_id;
        `;

        const res = await client
            .query(sql, [
                addressData.streetAddress,
                addressData.streetAddressLineTwo,
                addressData.city,
                addressData.province,
                addressData.postalCode,
                addressData.country,
            ])
            .finally(async () => client.release());
        return res.rows[0].address_id;
    }

    async updateUserRole(userId: number, roleId: number): Promise<number> {
        const client = await this.pool.connect();

        const sql = `
            UPDATE users
            SET role_id = $1
            WHERE users.user_id = $2
            AND users.role_id = $3
            RETURNING users.user_id;
        `;

        const res = await client
            .query(sql, [roleId, userId, UserRepository.defaultRoleId])
            .finally(async () => client.release());
        return res.rows[0]?.user_id;
    }

    async findRoleByUserId(userId: number): Promise<Role> {
        const client = await this.pool.connect();

        const sql = `
            SELECT roles.role_name
            FROM users, roles
            WHERE users.role_id = roles.role_id
            AND users.user_id = $1;
        `;

        const res = await client.query(sql, [userId]).finally(async () => client.release());
        return res.rows[0]?.role_name;
    }

    private buildUser({ rows }: QueryResult): User {
        if (rows.length == 0) {
            return null;
        }

        const row = rows[0];
        return {
            firstName: row.first_name,
            lastName: row.last_name,
            phoneNumber: row.phone_number,
            gender: Gender[row.gender],
            dateOfBirth: new Date(row.date_of_birth),
            role: Role[row.role_name],
            address: {
                addressId: row.address_id,
                streetAddress: row.street_address,
                streetAddressLineTwo: row.street_address_line_two,
                city: row.city,
                province: row.province,
                postalCode: row.postal_code,
                country: row.country,
            },
            account: {
                userId: row.user_id,
                email: row.email,
                password: row.password,
                createdOn: new Date(row.created_on),
            },
        };
    }
}
