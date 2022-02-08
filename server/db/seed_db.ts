import "dotenv/config";
import { Pool } from "pg";
import { users } from "./seed_data/user_data";
import * as bcrypt from "bcrypt";
import { addresses } from "./seed_data/address_data";
import { container } from "../src/registry";
import { UserRepository } from "../src/repositories/user_repository";

(async () => {
    const userRepository = container.getNamed<UserRepository>("Repository", "UserRepository");

    const pool = new Pool();
    const client = await pool.connect();

    await client.query("BEGIN");

    // add addresses
    await Promise.all(
        addresses.map(async (address) => {
            await userRepository.addAddress(address);
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

    await client.query("COMMIT");

    console.log("Finished seeding database...");

    client.release();
})().catch((e) => console.log(e));
