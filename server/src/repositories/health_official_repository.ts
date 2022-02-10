import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { Pool } from "pg";
import { Role } from "../entities/role";
import { UserRepository } from "./user_repository";

@injectable()
export class HealthOfficialRepository {
    constructor(
        @inject("DBConnectionPool") private readonly pool: Pool,
        @inject("Repository")
        @named("UserRepository")
        private readonly userRepository: UserRepository,
    ) {}

    async addHealthOfficial(userId: number): Promise<void> {
        const client = await this.pool.connect();

        await client.query("BEGIN;");

        await this.userRepository.updateUserRoleHelper(client, userId, Role.HEALTH_OFFICIAL);

        await client.query(`INSERT INTO health_officials (health_official_id) VALUES ($1);`, [userId]);

        await client.query("COMMIT;");
        client.release();
    }
}
