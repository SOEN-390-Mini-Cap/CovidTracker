import { agent } from "supertest";
import { app } from "../../src";
import { expect } from "chai";
import { restoreDb } from "../../db/restore_db";
import { seedDb } from "../../db/seed_db";
import { tokensFixture } from "../fixtures/tokens_fixture";

describe("notifications_controller.ts API", () => {
    beforeEach(async () => {
        await restoreDb();
        await seedDb();
    });

    describe("POST /notifications/sms endpoint", () => {
        it("should return 201 status and send sms notification", async () => {
            const res = await agent(app)
                .post("/notifications/sms")
                .send({
                    userId: 1,
                    body: "notification body",
                })
                .set("Authorization", `Bearer ${tokensFixture.doctor}`);

            expect(res.status).to.equal(201);
        });
    });

    describe("POST /notifications/email endpoint", () => {
        it("should return 201 status and send email notification", async () => {
            const res = await agent(app)
                .post("/notifications/email")
                .send({
                    userId: 1,
                    subject: "email subject",
                    body: "notification body",
                })
                .set("Authorization", `Bearer ${tokensFixture.doctor}`);

            expect(res.status).to.equal(201);
        });
    });
});
