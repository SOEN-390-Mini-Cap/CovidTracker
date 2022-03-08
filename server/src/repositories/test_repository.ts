import { inject, injectable } from "inversify";
import { Pool } from "pg";
import { TestResult } from "../entities/test_result";
import { Address } from "../entities/address";

@injectable()
export class TestRepository {
    constructor(@inject("DBConnectionPool") private readonly pool: Pool) {}

    async insertTestResult(testResults: TestResult): Promise<void> {
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
                testResults.testDate.toISOString(),
                testResults.address.addressId,
            ])
            .finally(() => client.release());
    }

    async findTestByTestId(testId: number): Promise<TestResult> {
        const client = await this.pool.connect();
        const queryString = `SELECT *
                             FROM test_results AS tr, addresses as a
                             WHERE tr.address_id = a.address_id
                             AND tr.test_id = $1`;

        const res = await client.query(queryString, [testId]).finally(async () => client.release());
        const row = res.rows[0];
        if (!row) {
            return null;
        }
        const address = this.buildAddress(row);
        return {
            testId: row.test_id,
            patientId: row.patient_id,
            result: row.result,
            testDate: row.test_date,
            testType: row.test_type,
            address: address,
        };
    }

    buildAddress(row: any): Address {
        return {
            addressId: row.address_id,
            streetAddress: row.street_address,
            streetAddressLineTwo: row.street_address_line_two,
            city: row.city,
            postalCode: row.postal_code,
            country: row.country,
            province: row.province,
        };
    }
}
