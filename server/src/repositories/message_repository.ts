import "reflect-metadata";
import { inject, injectable } from "inversify";
import { Pool, QueryResult } from "pg";
import { Message } from "../entities/message";

@injectable()
export class MessageRepository {
    constructor(@inject("DBConnectionPool") private readonly pool: Pool) {}

    async findMessages(userId: number): Promise<Message[]> {
        const client = await this.pool.connect();

        console.log(userId);

        const sql = `
            SELECT
                m.message_id,
                m.from_user_id,
                m.to_user_id,
                m.message_body,
                m.created_on
            FROM messages AS m
            WHERE m.from_user_id = $1 OR m.to_user_id = $1
            ORDER BY m.created_on DESC;
        `;
        const res = await client.query(sql, [userId]).finally(() => client.release());
        return this.buildMessages(res);
    }

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

    private buildMessages({ rows }: QueryResult): Message[] {
        console.log(rows);
        return rows.map(this.buildMessage);
    }

    private buildMessage(row: any): Message {
        if (!row) {
            return null;
        }

        return {
            messageId: +row.message_id,
            from: +row.from_user_id,
            to: +row.to_user_id,
            body: row.message_body,
            createdOn: new Date(row.created_on),
        };
    }
}
