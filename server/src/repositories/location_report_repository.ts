import { inject, injectable } from "inversify";
import { Pool } from "pg";
import { LocationReport } from "../entities/location_report";

@injectable()
export class LocationReportRepository {
    constructor(@inject("DBConnectionPool") private readonly pool: Pool) {}

    async insertLocationReport(locationReport: LocationReport): Promise<void> {
        const client = await this.pool.connect();

        const queryString = `
            INSERT INTO location_reports (
                user_id,
                address_id,
                created_on
            ) VALUES ($1, $2, $3)`;

        client
            .query(queryString, [
                locationReport.userId,
                locationReport.address.addressId,
                locationReport.createdOn.toISOString(),
            ])
            .finally(() => client.release());
    }
}
