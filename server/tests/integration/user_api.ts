import { agent } from "supertest";
import { app } from "../../src";
import { expect } from "chai";
import { restoreDb } from "../../db/restore_db";
import { seedDb } from "../../db/seed_db";
import { tokensFixture } from "../fixtures/tokens_fixture";
import { Role } from "../../src/entities/role";

describe("user_controller.ts API", () => {
    beforeEach(async () => {
        await restoreDb();
        await seedDb();
    });

    describe("GET /users/me endpoint", () => {
        it("should return 200 status and user from token", async () => {
            const res = await agent(app)
                .get("/users/me")
                .set("Authorization", `Bearer ${tokensFixture.doctor}`);

            expect(res.status).to.equal(200);
        });
    });

    describe("GET /users/:userId endpoint", () => {
        it("should return 200 status and user from parameters", async () => {
            const res = await agent(app)
                .get("/users/6")
                .set("Authorization", `Bearer ${tokensFixture.doctor}`);

            expect(res.status).to.equal(200);
        });
    });

    describe("PUT /users/:userId/roles endpoint", () => {
        it("should return 204 status and assign role", async () => {
            await agent(app).post("/auth/sign_up").send({
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
                .put("/users/10/roles")
                .send({
                    role: Role.PATIENT,
                })
                .set("Authorization", `Bearer ${tokensFixture.admin}`);

            expect(res.status).to.equal(204);
        });
    });
});
