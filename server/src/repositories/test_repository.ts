import { inject, injectable } from "inversify";
import { Pool } from "pg";
import { TestResult, TestResultWithAddress } from "../entities/test_result";
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
                testResults.addressId,
            ])
            .finally(() => client.release());
    }

    async findTestByTestId(testId: number): Promise<TestResultWithAddress> {
        const client = await this.pool.connect();
        const queryString = `SELECT *
                             FROM test_results AS tr
                             WHERE tr.test_id = $1`;

        const res = await client.query(queryString, [testId]).finally(async () => client.release());
        const row = res.rows[0];
        if (!row) {
            return null;
        }
        const address = await this.findAddressById(row.address_id);
        return {
            patientId: row.patient_id,
            result: row.result,
            testDate: row.test_date,
            testType: row.test_type,
            ...address,
        };
    }

    async findAddressById(addressId: number): Promise<Address> {
        const client = await this.pool.connect();
        const queryString = `SELECT *
                             FROM addresses AS a
                             WHERE a.address_id = $1`;
        const res = await client.query(queryString, [addressId]).finally(async () => client.release());
        const row = res.rows[0];
        if (!row) {
            return null;
        }
        return {
            addressId: row.address_id,
            streetAddress: row.street_address,
            streetAddressLineTwo: row.street_address_line_two,
            city: row.city,
            province: row.province,
            postalCode: row.postal_code,
            country: row.country,
        };
    }
}
