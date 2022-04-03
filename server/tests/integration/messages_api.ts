import { agent } from "supertest";
import { app } from "../../src";
import { expect } from "chai";
import { restoreDb } from "../../db/restore_db";
import { seedDb } from "../../db/seed_db";
import { tokensFixture } from "../fixtures/tokens_fixture";

describe("messages_controller.ts API", () => {
    beforeEach(async () => {
        await restoreDb();
        await seedDb();
    });

    describe("GET /messages endpoint", () => {
        it("should return 200 status and messages", async () => {
            const res = await agent(app)
                .get("/messages?userId=2")
                .set("Authorization", `Bearer ${tokensFixture.doctor}`);

            expect(res.status).to.equal(200);
        });
    });

    describe("GET /messages/chats endpoint", () => {
        it("should return 200 status and user chats", async () => {
            const res = await agent(app)
                .get("/messages/chats")
                .set("Authorization", `Bearer ${tokensFixture.doctor}`);

            expect(res.status).to.equal(200);
        });
    });

    describe("POST /messages endpoint", () => {
        it("should return 201 status and send message", async () => {
            const res = await agent(app)
                .post("/messages")
                .send({
                    to: 2,
                    body: "chat message body",
                    isPriority: false,
                })
                .set("Authorization", `Bearer ${tokensFixture.doctor}`);

            expect(res.status).to.equal(201);
        });
    });
});
