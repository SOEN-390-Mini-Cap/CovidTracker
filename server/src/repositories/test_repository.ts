import { inject, injectable } from "inversify";
import { Pool } from "pg";
import { TestResult } from "../entities/test_result";

@injectable()
export class TestRepository {
    constructor(@inject("DBConnectionPool") private readonly pool: Pool) {}

    async insertTestResult(testResults: TestResult) {
        const client = await this.pool.connect();

        const queryString = `INSERT INTO test_results 
                            (patient_id, 
                             result, 
                             test_type, 
                             test_date,
                             address_id)
                             VALUES ($1, $2, $3, $4, $5)`;

        client
            .query(queryString, [
                testResults.patientId,
                testResults.result,
                testResults.testType,
                testResults.testDate,
                testResults.addressId,
            ])
            .finally(() => client.release());
    }
}
