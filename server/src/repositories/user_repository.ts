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
                address_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
                addressId,
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
            FROM users, user_roles, roles, addresses
            WHERE users.user_id = user_roles.user_id
              AND user_roles.role_id = roles.role_id
              AND users.address_id = addresses.address_id
              AND users.email = $1;
        `;
        const res = await client.query(sql, [email]).finally(async () => client.release());

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

    private buildUser({ rows }: QueryResult): User {
        if (rows.length == 0) {
            return null;
        }

        const firstRow = rows[0];
        const roles: Role[] = firstRow.role_name ? rows.map((row) => Role[row.role_name]) : [];

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
            address: {
                addressId: firstRow.address_id,
                userId: firstRow.user_id,
                streetAddress: firstRow.street_address,
                streetAddressLineTwo: firstRow.street_address_line_two,
                city: firstRow.city,
                province: firstRow.province,
                postalCode: firstRow.postal_code,
                country: firstRow.country,
            },
        };
    }
}
