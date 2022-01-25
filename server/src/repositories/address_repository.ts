import "reflect-metadata";
import { inject, injectable } from "inversify";
import { Pool } from "pg";
import { AddressReqData } from "../controllers/authentication_controller";

@injectable()
export class AddressRepository {
    constructor(@inject("DBConnectionPool") private readonly pool: Pool) {}

    async add(userId: string, addressData: AddressReqData): Promise<void> {
        const client = await this.pool.connect();

        const sql = `
            INSERT INTO addresses (
                user_id,
                street_address,
                street_address_line_two,
                city,
                province,
                postal_code,
                country        
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;

        await client
            .query(sql, [
                userId,
                addressData.streetAddress,
                addressData.streetAddressLineTwo,
                addressData.city,
                addressData.province,
                addressData.postalCode,
                addressData.country,
            ])
            .finally(async () => client.release());
    }
}
