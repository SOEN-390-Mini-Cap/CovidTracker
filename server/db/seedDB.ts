import "dotenv/config";
import { Pool } from "pg";
import {users} from "./seed_data/UserData";
import {userRoles} from "./seed_data/UserRoleData";
import {ROLES} from "../src/entities/Roles";

(async () => {
    const pool = new Pool();
    const client = await pool.connect();

    // add roles
    await Promise.all(ROLES.map(async (role) => {
        const res = await client.query(`
            INSERT INTO roles (role_name) VALUES ('${role}');
        `);
        console.log(res);
    }));

    // add users
    await Promise.all(users.map(async (user) => {
        const res = await client.query(`
            INSERT INTO users (email, password, first_name, last_name, date_of_birth) 
                VALUES ('${user.email}', '${user.password}', '${user.first_name}', '${user.last_name}', '${user.date_of_birth}');
        `);
        console.log(res);
    }));

    // add user roles
    await Promise.all(userRoles.map(async (userRole) => {
        const res = await client.query(`
            INSERT INTO user_roles (user_id, role_id) VALUES ('${userRole.user_id}', '${userRole.role_id}');
        `);
        console.log(res);
    }));

    console.log("Finished seeding database...");

    client.release();
})().catch(e => console.log(e));
