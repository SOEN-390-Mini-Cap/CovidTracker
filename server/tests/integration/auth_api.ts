import { agent } from "supertest";
import { app } from "../../src";
import { expect } from "chai";
import { restoreDb } from "../../db/restore_db";
import { seedDb } from "../../db/seed_db";

describe("authentication_controller.ts API", () => {
    beforeEach(async () => {
        await restoreDb();
        await seedDb();
    });

    describe("POST /auth/sign_up endpoint", () => {
        it("should return 201 status and token when sign up is successful", async () => {
            const res = await agent(app).post("/auth/sign_up").send({
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

            expect(res.status).to.equal(201);
            expect("token" in res.body).to.equal(true);
        });

        it("should return 500 status user email already exists", async () => {
            const res = await agent(app).post("/auth/sign_up").send({
                firstName: "fname",
                lastName: "lname",
                phoneNumber: "1231231234",
                gender: "MALE",
                dateOfBirth: "2000-01-25T18:09:13.127Z",
                streetAddress: "1000th place",
                city: "city name",
                postalCode: "A1B 2C3",
                province: "Quebec",
                email: "test1@test.com",
                password: "Test123!",
            });

            expect(res.status).to.equal(500);
            expect("error" in res.body).to.equal(true);
        });
    });

    describe("POST /auth/sign_in endpoint", () => {
        it("should return 200 status and token when sign in is successful", async () => {
            const res = await agent(app).post("/auth/sign_in").send({
                email: "test1@test.com",
                password: "Test123!",
            });

            expect(res.status).to.equal(200);
            expect("token" in res.body).to.equal(true);
        });

        it("should return 401 status when user is not found", async () => {
            const res = await agent(app).post("/auth/sign_in").send({
                email: "not-exist-test@test.com",
                password: "Test123!",
            });

            expect(res.status).to.equal(401);
            expect(res.body.error).to.equal("User not authenticated");
        });

        it("should return 401 status when password does not match", async () => {
            const res = await agent(app).post("/auth/sign_in").send({
                email: "test1@test.com",
                password: "Password123!",
            });

            expect(res.status).to.equal(401);
            expect(res.body.error).to.equal("User not authenticated");
        });
    });
});
