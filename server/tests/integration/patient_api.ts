import { agent } from "supertest";
import { app } from "../../src";
import { expect } from "chai";
import { restoreDb } from "../../db/restore_db";
import { seedDb } from "../../db/seed_db";
import { tokensFixture } from "../fixtures/tokens_fixture";
import { get_patients_doctor_fixture, get_patients_health_official_fixture } from "../fixtures/get_patients_fixture";

describe("patient_controller.ts API", () => {
    beforeEach(async () => {
        await restoreDb();
        await seedDb();
    });

    describe("POST /patients/:patientId/doctors endpoint", () => {
        it("should return 201 status", async () => {
            const res = await agent(app)
                .post("/patients/5/doctors")
                .send({
                    doctorId: 6,
                })
                .set("Authorization", `Bearer ${tokensFixture.admin}`);

            expect(res.status).to.equal(201);
        });

        it("should return 500 status when admin tries to re-assign patient to new doctor", async () => {
            const res = await agent(app)
                .post("/patients/4/doctors")
                .send({
                    doctorId: 6,
                })
                .set("Authorization", `Bearer ${tokensFixture.admin}`);

            expect(res.status).to.equal(500);
            expect(res.body.error).to.equal("Patient can not be assigned a new doctor");
        });

        it("should return 403 unauthorized status when user role is not admin", async () => {
            const res = await agent(app)
                .post("/patients/5/doctors")
                .send({
                    doctorId: 6,
                })
                .set("Authorization", `Bearer ${tokensFixture.doctor}`);

            expect(res.status).to.equal(403);
        });
    });

    describe("GET /patients endpoint", () => {
        it("should return 200 status and list of all patients as a health official", async () => {
            const res = await agent(app)
                .get("/patients")
                .set("Authorization", `Bearer ${tokensFixture.healthOfficial}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(get_patients_health_official_fixture);
        });

        it("should return 200 status and list of patients for a doctor", async () => {
            const res = await agent(app).get("/patients").set("Authorization", `Bearer ${tokensFixture.doctor}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(get_patients_doctor_fixture);
        });

        it("should return 403 unauthorized status when user role is accepted", async () => {
            const res = await agent(app).get("/patients").set("Authorization", `Bearer ${tokensFixture.admin}`);

            expect(res.status).to.equal(403);
        });
    });

    describe("PUT /patients/:patientId/prioritize endpoint", () => {
        it("should return 204 status when setting isPrioritized true", async () => {
            const res = await agent(app)
                .put("/patients/1/prioritize")
                .send({
                    isPrioritized: true,
                })
                .set("Authorization", `Bearer ${tokensFixture.doctor}`);

            expect(res.status).to.equal(204);
        });

        it("should return 204 status when setting isPrioritized false", async () => {
            const res = await agent(app)
                .put("/patients/1/prioritize")
                .send({
                    isPrioritized: false,
                })
                .set("Authorization", `Bearer ${tokensFixture.immigrationOfficer}`);

            expect(res.status).to.equal(204);
        });
    });
});
