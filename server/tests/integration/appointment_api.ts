import { agent } from "supertest";
import { app } from "../../src";
import { expect } from "chai";
import { restoreDb } from "../../db/restore_db";
import { seedDb } from "../../db/seed_db";
import { tokensFixture } from "../fixtures/tokens_fixture";

describe("appointment_controller.ts API", () => {
    beforeEach(async () => {
        await restoreDb();
        await seedDb();
    });

    describe("GET /appointments endpoint", () => {
        it("should return 200 status and appointment list", async () => {
            const res = await agent(app)
                .get("/appointments")
                .set("Authorization", `Bearer ${tokensFixture.doctor}`);

            expect(res.status).to.equal(200);
        });
    });

    describe("POST /appointments endpoint", () => {
        it("should return 201 status and create appointment", async () => {
            const res = await agent(app)
                .post("/appointments")
                .send({
                    patientId: 1,
                    startDate: "2022-01-25 05:02:32.162000 +00:00",
                    endDate: "2022-01-25 06:02:32.162000 +00:00",
                    streetAddress: "1000th place",
                    city: "city name",
                    postalCode: "A1B 2C3",
                    province: "Quebec",
                })
                .set("Authorization", `Bearer ${tokensFixture.doctor}`);

            expect(res.status).to.equal(200);
        });
    });
});
