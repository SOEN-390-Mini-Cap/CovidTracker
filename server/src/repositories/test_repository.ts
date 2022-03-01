import { inject, injectable } from "inversify";
import { Pool } from "pg";

@injectable()
export class TestRepository {
    constructor(@inject("DBConnectionPool") private readonly pool: Pool) {}

    async addTestResult() {
        return;
    }
}
