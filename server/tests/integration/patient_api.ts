import { agent } from "supertest";
import { app } from "../../src";
import { expect } from "chai";
import { restoreDb } from "../../db/restore_db";
import { seedDb } from "../../db/seed_db";
import { tokens } from "../fixtures/tokens";

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
                .set("Authorization", `Bearer ${tokens.admin}`);

            expect(res.status).to.equal(201);
        });

        it("should return 500 status when admin tries to re-assign patient to new doctor", async () => {
            const res = await agent(app)
                .post("/patients/4/doctors")
                .send({
                    doctorId: 6,
                })
                .set("Authorization", `Bearer ${tokens.admin}`);

            expect(res.status).to.equal(500);
            expect(res.body.error).to.equal("Patient can not be assigned a new doctor");
        });

        it("should return 403 unauthorized status when user role is not admin", async () => {
            const res = await agent(app)
                .post("/patients/5/doctors")
                .send({
                    doctorId: 6,
                })
                .set("Authorization", `Bearer ${tokens.doctor}`);

            expect(res.status).to.equal(403);
        });
    });

    describe("GET /patients endpoint", () => {
        it("should return 200 status and list of all patients", async () => {
            const res = await agent(app).get("/patients").set("Authorization", `Bearer ${tokens.healthOfficial}`);

            expect(res.status).to.equal(200);
            expect(res.body.length).to.deep.equal(5);
        });

        it("should return 200 status and list of patients for a doctor", async () => {
            const res = await agent(app).get("/patients").set("Authorization", `Bearer ${tokens.doctor}`);

            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(4);
        });

        it("should return 403 unauthorized status when user role is accepted", async () => {
            const res = await agent(app).get("/patients").set("Authorization", `Bearer ${tokens.admin}`);

            expect(res.status).to.equal(403);
        });
    });
});
