import "dotenv/config";
import { Pool } from "pg";
import { users } from "./seed_data/user_data";
import { userRoles } from "./seed_data/user_role_data";
import { ROLES } from "../src/entities/role";
import * as bcrypt from "bcrypt";
import { addresses } from "./seed_data/address_data";
import { container } from "../src/registry";
import { UserRepository } from "../src/repositories/user_repository";

(async () => {
    const userRepository = container.getNamed<UserRepository>("Repository", "UserRepository");

    const pool = new Pool();
    const client = await pool.connect();

    await client.query("BEGIN");

    // add roles
    await Promise.all(
        ROLES.map(async (role) => {
            await client.query(`
                INSERT INTO roles (role_name) VALUES ('${role}');
            `);
        }),
    );

    await client.query("COMMIT");

    console.log("Finished seeding roles");

    // add addresses
    await Promise.all(
        addresses.map(async (address) => {
            await userRepository.addAddress(address).catch((e) => console.log(e));
        }),
    );

    console.log("Finished seeding addresses");

    // add users
    await Promise.all(
        users.map(async ({ userData, addressId }) => {
            userData.password = await bcrypt.hash(userData.password, 10);
            await userRepository.addUser(userData, addressId);
        }),
    );

    console.log("Finished seeding users");

    // add user roles
    await Promise.all(
        userRoles.map(async (userRole) => {
            await client.query(`
                INSERT INTO user_roles (user_id, role_id) VALUES ('${userRole.user_id}', '${userRole.role_id}');
            `);
        }),
    );

    console.log("Finished seeding user roles");

    console.log("Finished seeding database...");

    client.release();
})().catch((e) => console.log(e));
