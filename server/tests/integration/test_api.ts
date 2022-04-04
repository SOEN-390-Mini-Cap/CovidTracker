import { agent } from "supertest";
import { app } from "../../src";
import { expect } from "chai";
import { restoreDb } from "../../db/restore_db";
import { seedDb } from "../../db/seed_db";
import { tokensFixture } from "../fixtures/tokens_fixture";

describe("test_controller.ts API", () => {
    beforeEach(async () => {
        await restoreDb();
        await seedDb();
    });

    describe("POST /tests/patients/:patientId endpoint", () => {
        it("should return 201 status when test result is added by a health official successfully", async () => {
            const res = await agent(app)
                .post("/tests/patients/3")
                .send({
                    result: "POSITIVE",
                    testType: "PCR",
                    testDate: "05-11-1999",
                    streetAddress: "1001th street",
                    city: "Montreal",
                    postalCode: "A1B 2C3",
                    province: "Quebec",
                })
                .set("Authorization", `Bearer ${tokensFixture.healthOfficial}`);

            expect(res.status).to.equal(201);
        });

        it("should return 201 status when test result is added by a doctor to his own patient successfully", async () => {
            const res = await agent(app)
                .post("/tests/patients/3")
                .send({
                    result: "POSITIVE",
                    testType: "PCR",
                    testDate: "05-11-1999",
                    streetAddress: "1001th street",
                    city: "Montreal",
                    postalCode: "A1B 2C3",
                    province: "Quebec",
                })
                .set("Authorization", `Bearer ${tokensFixture.doctor}`);

            expect(res.status).to.equal(201);
        });

        it("should return 400 when body is not well formatted", async () => {
            const res = await agent(app)
                .post("/tests/patients/3")
                .send({
                    result: "Not POSITIVE",
                    testType: "PCR",
                    testDate: "05/11/1999",
                    streetAddress: "1001th street",
                    city: "Montreal",
                    postalCode: "A1B 2C3",
                    province: "Quebec",
                })
                .set("Authorization", `Bearer ${tokensFixture.healthOfficial}`);

            expect(res.status).to.equal(400);
        });

        it("should return 403 when user is not a health official or a doctor", async () => {
            const res = await agent(app)
                .post("/tests/patients/3")
                .send({
                    result: "POSITIVE",
                    testType: "PCR",
                    testDate: "05/11/1999",
                    streetAddress: "1001th street",
                    city: "Montreal",
                    postalCode: "A1B 2C3",
                    province: "Quebec",
                })
                .set("Authorization", `Bearer ${tokensFixture.patient5}`);

            expect(res.status).to.equal(403);
        });

        it("should return 403 when when doctor is not the patients doctor", async () => {
            const res = await agent(app)
                .post("/tests/patients/7")
                .send({
                    result: "POSITIVE",
                    testType: "PCR",
                    testDate: "05/11/1999",
                    streetAddress: "1001th street",
                    city: "Montreal",
                    postalCode: "A1B 2C3",
                    province: "Quebec",
                })
                .set("Authorization", `Bearer ${tokensFixture.doctor}`);

            expect(res.status).to.equal(403);
        });
    });
    describe("GET /tests/patients/:patientId endpoint", () => {
        it("should return 200 status if test is fetched successfully when patient access there own tests", async () => {
            const res = await agent(app)
                .get("/tests/patients/3")
                .set("Authorization", `Bearer ${tokensFixture.patient3}`);
            expect(res.status).to.equal(200);
        });
        it("should return 200 status if test is fetched successfully when health official access a test", async () => {
            const res = await agent(app)
                .get("/tests/patients/3")
                .set("Authorization", `Bearer ${tokensFixture.healthOfficial}`);
            expect(res.status).to.equal(200);
        });

        it("should return 200 when doctor access there patient's test", async () => {
            const res = await agent(app)
                .get("/tests/patients/3")
                .set("Authorization", `Bearer ${tokensFixture.doctor}`);
            expect(res.status).to.equal(200);
        });

        it("should return 403 when user is patient but the test does not belong to that patient", async () => {
            const res = await agent(app)
                .get("/tests/patients/3")
                .set("Authorization", `Bearer ${tokensFixture.patient5}`);

            expect(res.status).to.equal(403);
        });
    });

    describe("GET /tests/:testId endpoint", () => {
        it("should return 200 status if test is fetched successfully when patient access there own test", async () => {
            const res = await agent(app).get("/tests/22").set("Authorization", `Bearer ${tokensFixture.patient3}`);
            expect(res.status).to.equal(200);
        });
        it("should return 200 status if test is fetched successfully when health official access a test", async () => {
            const res = await agent(app).get("/tests/1").set("Authorization", `Bearer ${tokensFixture.healthOfficial}`);
            expect(res.status).to.equal(200);
        });

        it("should return 200 when doctor access there patient's test", async () => {
            const res = await agent(app).get("/tests/1").set("Authorization", `Bearer ${tokensFixture.doctor}`);
            expect(res.status).to.equal(200);
        });

        it("should return 403 when user is patient but the test does not belong to that patient", async () => {
            const res = await agent(app).get("/tests/1").set("Authorization", `Bearer ${tokensFixture.patient5}`);

            expect(res.status).to.equal(403);
        });
    });
});
