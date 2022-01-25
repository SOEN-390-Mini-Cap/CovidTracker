import "reflect-metadata";
import { inject, injectable } from "inversify";
import { Pool } from "pg";
import { AddressReqData } from "../controllers/authentication_controller";

@injectable()
export class AddressRepository {
    constructor(@inject("DBConnectionPool") private readonly pool: Pool) {}

    async createAddress(userId: string, addressData: AddressReqData): Promise<void> {
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
            ) VALUES (
                '${userId}',
                '${addressData.streetAddress}',
                '${addressData.streetAddressLineTwo}',
                '${addressData.city}',
                '${addressData.province}',
                '${addressData.postalCode}',
                '${addressData.country}'
            )
        `;
        await client.query(sql).finally(async () => client.release());
    }
}
