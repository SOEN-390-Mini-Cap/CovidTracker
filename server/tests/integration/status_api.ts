import { agent } from "supertest";
import { app } from "../../src";
import { expect } from "chai";
import { restoreDb } from "../../db/restore_db";
import { seedDb } from "../../db/seed_db";

describe("patient_controller.ts API", () => {
    // patientId -> 5
    const patientToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTY0NTEzNzk0Mn0.UcpnGpWBhdM4OEgKOrJEWXoknk9-I_2Cf19pJWkS5eY";

    beforeEach(async () => {
        await restoreDb();
        await seedDb();
    });

    describe("POST /statuses/patients/:patientId endpoint", () => {
        it("should return 201 status", async () => {
            const res = await agent(app)
                .post("/statuses/patients/5")
                .send({
                    temperature: 30.2,
                    weight: 150,
                    otherSymptoms: "N/A",
                })
                .set("Authorization", `Bearer ${patientToken}`);

            expect(res.status).to.equal(201);
        });

        it("should return 500 status when patient tries to submit 2 statuses on the same calendar day", async () => {
            await agent(app)
                .post("/statuses/patients/5")
                .send({
                    temperature: 30.2,
                    weight: 150,
                    otherSymptoms: "N/A",
                })
                .set("Authorization", `Bearer ${patientToken}`);
            const res = await agent(app)
                .post("/statuses/patients/5")
                .send({
                    temperature: 30.2,
                    weight: 150,
                    otherSymptoms: "N/A",
                })
                .set("Authorization", `Bearer ${patientToken}`);

            expect(res.status).to.equal(500);
            expect(res.body.error).to.equal("A patient can only submit one status report per calendar day");
        });

        it("should return 500 status when status is missing fields defined by doctor", async () => {
            const res = await agent(app)
                .post("/statuses/patients/5")
                .send({
                    temperature: 30.2,
                    weight: 150,
                })
                .set("Authorization", `Bearer ${patientToken}`);

            expect(res.status).to.equal(500);
            expect(res.body.error).to.equal("Status is malformed");
        });

        it("should return 403 unauthorized status when requesting patientId is not the same as the logged in patient", async () => {
            const res = await agent(app)
                .post("/statuses/patients/4")
                .send({
                    temperature: 30.2,
                    weight: 150,
                })
                .set("Authorization", `Bearer ${patientToken}`);

            expect(res.status).to.equal(403);
        });
    });
});
