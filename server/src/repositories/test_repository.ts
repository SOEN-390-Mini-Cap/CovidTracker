import { inject, injectable } from "inversify";
import { Pool } from "pg";
import { TestResults } from "../entities/test";

@injectable()
export class TestRepository {
    constructor(@inject("DBConnectionPool") private readonly pool: Pool) {}

    async addTestResult(testResults: TestResults) {
        const client = await this.pool.connect();

        const queryString = `INSERT INTO test_results 
                            (patient_id, 
                             test_result, 
                             type_of_test, 
                             date_of_test,
                             address_id)
                             VALUES ($1, $2, $3, $4, $5)`;

        client
            .query(queryString, [
                testResults.patientId,
                testResults.testResult,
                testResults.typeOfTest,
                testResults.dateOfTest,
                testResults.addressId,
            ])
            .finally(() => client.release());
    }
}
