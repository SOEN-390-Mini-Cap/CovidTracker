import { agent } from "supertest";
import { app } from "../../src";
import { expect } from "chai";
import { restoreDb } from "../../db/restore_db";
import { seedDb } from "../../db/seed_db";
import exp = require("constants");

describe("patient_controller.ts API", () => {
    const adminToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTY0NTEzNzcwNH0.9z9YC_xaJGTBannHaHK3ZsG7TIbC5cGQROMUNzmlhYY";
    const patientToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTY0NTEzNzk0Mn0.UcpnGpWBhdM4OEgKOrJEWXoknk9-I_2Cf19pJWkS5eY";

    beforeEach(async () => {
        await restoreDb();
        await seedDb();
    });

    describe("POST /patients/:patientId/doctors endpoint", () => {
        it("should return 201 status and token when sign up is successful", async () => {
            const res = await agent(app)
                .post("/patients/3/doctors")
                .send({
                    doctorId: 1,
                })
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).to.equal(201);
        });

        it("should return 500 status when admin tries to re-assign patient to new doctor", async () => {
            const res = await agent(app)
                .post("/patients/4/doctors")
                .send({
                    doctorId: 2,
                })
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).to.equal(500);
            expect(res.body.error).to.equal("Patient can not be assigned a new doctor");
        });

        it("should return 403 unauthorized status when user role is not admin", async () => {
            const res = await agent(app)
                .post("/patients/3/doctors")
                .send({
                    doctorId: 1,
                })
                .set("Authorization", `Bearer ${patientToken}`);

            expect(res.status).to.equal(403);
        });
    });
});
