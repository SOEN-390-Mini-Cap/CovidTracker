import "dotenv/config";
import { Pool } from "pg";
import { users } from "./seed_data/user_data";
import { userRoles } from "./seed_data/user_role_data";
import { ROLES } from "../src/entities/role";
import * as bcrypt from "bcrypt";
import { addresses } from "./seed_data/address_data";

(async () => {
    const pool = new Pool();
    const client = await pool.connect();

    // add roles
    await Promise.all(
        ROLES.map(async (role) => {
            const res = await client.query(`
            INSERT INTO roles (role_name) VALUES ('${role}');
        `);
            console.log(res);
        }),
    );

    // add users
    await Promise.all(
        users.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, 10);

            const res = await client.query(`
            INSERT INTO users (email, password, first_name, last_name, phone_number, gender, date_of_birth) 
                VALUES ('${user.email}', '${hashedPassword}', '${user.first_name}', '${user.last_name}', '${user.phone_number}', '${user.gender}', '${user.date_of_birth}');
        `);
            console.log(res);
        }),
    );

    // add user roles
    await Promise.all(
        userRoles.map(async (userRole) => {
            const res = await client.query(`
            INSERT INTO user_roles (user_id, role_id) VALUES ('${userRole.user_id}', '${userRole.role_id}');
        `);
            console.log(res);
        }),
    );

    // add addresses
    await Promise.all(
        addresses.map(async (address) => {
            const res = await client.query(
                `
                INSERT INTO addresses (
                    user_id,
                    street_address,
                    street_address_line_two,
                    city,
                    province,
                    postal_code,
                    country
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            `,
                [
                    address.userId,
                    address.streetAddress,
                    address.streetAddressLineTwo,
                    address.city,
                    address.province,
                    address.postalCode,
                    address.country,
                ],
            );
            console.log(res);
        }),
    );

    console.log("Finished seeding database...");

    client.release();
})().catch((e) => console.log(e));
