import "reflect-metadata";
import { inject, injectable } from "inversify";
import { Pool, QueryResult } from "pg";
import { User } from "../entities/user";
import { Gender } from "../entities/gender";
import { Role } from "../entities/role";
import { RequestUser } from "../entities/request/RequestUser";
import { RequestAddress } from "../entities/request/RequestAddress";
import { Address } from "../entities/address";

@injectable()
export class UserRepository {
    constructor(@inject("DBConnectionPool") private readonly pool: Pool) {}

    async addUser(userData: RequestUser): Promise<number> {
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
                street_address,
                street_address_line_two,
                city,
                province,
                postal_code,
                country
            FROM users, user_roles, roles, addresses
            WHERE users.user_id = user_roles.user_id
              AND user_roles.role_id = roles.role_id
              AND users.user_id = addresses.user_id
              AND users.email = $1;
        `;
        const res = await client.query(sql, [email]).finally(async () => client.release());

        return this.buildUser(res);
    }

    async addAddress(userId: number, addressData: RequestAddress): Promise<void> {
        const client = await this.pool.connect();

        const sql = `
            INSERT INTO addresses (
                user_id,
                street_address,
                street_address_line_two,
                city,
                province,
                postal_code,
                country        
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;

        await client
            .query(sql, [
                userId,
                addressData.streetAddress,
                addressData.streetAddressLineTwo,
                addressData.city,
                addressData.province,
                addressData.postalCode,
                addressData.country,
            ])
            .finally(async () => client.release());
    }

    private buildUser({ rows }: QueryResult): User {
        if (rows.length == 0) {
            return null;
        }

        const firstRow = rows[0];
        const roles: Role[] = firstRow.role_name ? rows.map((row) => Role[row.role_name]) : [];
        const addresses: Address[] = firstRow.street_address
            ? rows.map((row) => ({
                  addressId: row.address_id,
                  userId: row.user_id,
                  streetAddress: row.street_address,
                  streetAddressLineTwo: row.street_address_line_two,
                  city: row.city,
                  province: row.province,
                  postalCode: row.postal_code,
                  country: row.country,
              }))
            : [];

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
            addresses,
        };
    }
}
