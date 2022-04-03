import { agent } from "supertest";
import { app } from "../../src";
import { expect } from "chai";
import { restoreDb } from "../../db/restore_db";
import { seedDb } from "../../db/seed_db";
import { tokensFixture } from "../fixtures/tokens_fixture";

describe("dashboard_controller.ts API", () => {
    beforeEach(async () => {
        await restoreDb();
        await seedDb();
    });

    describe("GET /dashboards endpoint", () => {
        it("should return 200 status and user dashboard", async () => {
            const signUpRes = await agent(app).post("/auth/sign_up").send({
                firstName: "fname",
                lastName: "lname",
                phoneNumber: "1231231234",
                gender: "MALE",
                dateOfBirth: "2000-01-25T18:09:13.127Z",
                streetAddress: "1000th place",
                city: "city name",
                postalCode: "A1B 2C3",
                province: "Quebec",
                email: "new-test@test.com",
                password: "Test123!",
            });

            const res = await agent(app)
                .get("/dashboards")
                .set("Authorization", `Bearer ${signUpRes.body.token}`);

            expect(res.status).to.equal(200);
        });

        it("should return 200 status and patient dashboard", async () => {
            const res = await agent(app)
                .get("/dashboards")
                .set("Authorization", `Bearer ${tokensFixture.patient3}`);

            expect(res.status).to.equal(200);
        });

        it("should return 200 status and doctor dashboard", async () => {
            const res = await agent(app).get("/dashboards").set("Authorization", `Bearer ${tokensFixture.doctor}`);

            expect(res.status).to.equal(200);
        });

        it("should return 200 status and admin dashboard", async () => {
            const res = await agent(app)
                .get("/dashboards")
                .set("Authorization", `Bearer ${tokensFixture.admin}`);

            expect(res.status).to.equal(200);
        });

        it("should return 200 status and health official dashboard", async () => {
            const res = await agent(app)
                .get("/dashboards")
                .set("Authorization", `Bearer ${tokensFixture.healthOfficial}`);

            expect(res.status).to.equal(200);
        });

        it("should return 200 status and immigration officer dashboard", async () => {
            const res = await agent(app)
                .get("/dashboards")
                .set("Authorization", `Bearer ${tokensFixture.immigrationOfficer}`);

            expect(res.status).to.equal(200);
        });
    });
});
