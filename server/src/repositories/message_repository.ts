import "reflect-metadata";
import { inject, injectable } from "inversify";
import { Pool } from "pg";
import { Message } from "../entities/message";

@injectable()
export class MessageRepository {
    constructor(@inject("DBConnectionPool") private readonly pool: Pool) {}

    // async findMessages(userId: number): Promise<Message[]> {
    //     const client = await this.pool.connect();
    //
    //     const sql = `
    //         SELECT
    //             s.status_id,
    //             s.patient_id,
    //             s.status_body,
    //             s.is_reviewed,
    //             s.created_on
    //         FROM statuses AS s
    //         JOIN patients AS p ON p.patient_id = s.patient_id
    //         WHERE p.assigned_doctor_id = $1
    //         ORDER BY s.created_on DESC;
    //     `;
    //     const res = await client.query(sql, [doctorId]).finally(() => client.release());
    //     return this.buildStatuses(res);
    // }

    async insertMessage(message: Message): Promise<void> {
        const client = await this.pool.connect();

        const sql = `
            INSERT INTO messages (
                from_user_id,
                to_user_id,
                message_body,
                created_on
            )
            VALUES ($1, $2, $3, $4);
        `;
        await client
            .query(sql, [message.from, message.to, message.body, message.createdOn])
            .finally(() => client.release());
    }
}
