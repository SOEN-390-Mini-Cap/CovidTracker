import { agent } from "supertest";
import { app } from "../../src";
import { expect } from "chai";
import { restoreDb } from "../../db/restore_db";
import { seedDb } from "../../db/seed_db";
import { tokensFixture } from "../fixtures/tokens_fixture";
import { getStatusesFixture } from "../fixtures/get_statuses_fixture";
import { getStatusesForPatientFixture } from "../fixtures/get_statuses_for_patient_fixture";

describe("status_controller.ts API", () => {
    beforeEach(async () => {
        await restoreDb();
        await seedDb();
    });

    describe("POST /statuses/patients/:patientId endpoint", () => {
        it("should return 201 status", async () => {
            const res = await agent(app)
                .post("/statuses/patients/4")
                .send({
                    weight: 150,
                    temperature: 29,
                    fever: true,
                    cough: false,
                    shortnessOfBreath: false,
                    lossOfTasteAndSmell: true,
                    nausea: false,
                    stomachAches: false,
                    vomiting: false,
                    headache: false,
                    musclePain: false,
                    soreThroat: false,
                    otherSymptoms: "No other symptoms",
                })
                .set("Authorization", `Bearer ${tokensFixture.patient4}`);

            expect(res.status).to.equal(201);
        });

        it("should return 201 status when patient tries to submit 2 statuses on the same calendar day", async () => {
            await agent(app)
                .post("/statuses/patients/4")
                .send({
                    temperature: 30.2,
                    weight: 150,
                    fever: true,
                    cough: false,
                    shortnessOfBreath: false,
                    lossOfTasteAndSmell: true,
                    nausea: false,
                    stomachAches: false,
                    vomiting: false,
                    headache: false,
                    musclePain: false,
                    soreThroat: false,
                    otherSymptoms: "N/A",
                })
                .set("Authorization", `Bearer ${tokensFixture.patient4}`);
            const res = await agent(app)
                .post("/statuses/patients/4")
                .send({
                    temperature: 30.2,
                    weight: 150,
                    fever: true,
                    cough: false,
                    shortnessOfBreath: false,
                    lossOfTasteAndSmell: true,
                    nausea: false,
                    stomachAches: false,
                    vomiting: false,
                    headache: false,
                    musclePain: false,
                    soreThroat: false,
                    otherSymptoms: "N/A",
                })
                .set("Authorization", `Bearer ${tokensFixture.patient4}`);

            expect(res.status).to.equal(201);
        });

        it("should return 500 status when status is missing fields defined by doctor", async () => {
            const res = await agent(app)
                .post("/statuses/patients/4")
                .send({
                    temperature: 30.2,
                    weight: 150,
                })
                .set("Authorization", `Bearer ${tokensFixture.patient4}`);

            expect(res.status).to.equal(500);
            expect(res.body.error).to.equal("Status is malformed");
        });

        it("should return 403 unauthorized status when requesting patientId is not the same as the logged in patient", async () => {
            const res = await agent(app)
                .post("/statuses/patients/3")
                .send({
                    temperature: 30.2,
                    weight: 150,
                    fever: true,
                    cough: false,
                    shortnessOfBreath: false,
                    lossOfTasteAndSmell: true,
                    nausea: false,
                    stomachAches: false,
                    vomiting: false,
                    headache: false,
                    musclePain: false,
                    soreThroat: false,
                    otherSymptoms: "N/A",
                })
                .set("Authorization", `Bearer ${tokensFixture.patient4}`);

            expect(res.status).to.equal(403);
        });
    });

    describe("GET /statuses/patients/:patientId endpoint", () => {
        it("should return 200 status code and list of patients statuses", async () => {
            const res = await agent(app)
                .get("/statuses/patients/3")
                .set("Authorization", `Bearer ${tokensFixture.patient3}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(getStatusesForPatientFixture);
        });

        it("should return 200 status code and empty list of patients statuses", async () => {
            const res = await agent(app)
                .get("/statuses/patients/4")
                .set("Authorization", `Bearer ${tokensFixture.patient4}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal([]);
        });

        it("should return 403 unauthorized status when requesting patientId is not the same as the logged in patient", async () => {
            const res = await agent(app)
                .get("/statuses/patients/4")
                .set("Authorization", `Bearer ${tokensFixture.patient3}`);

            expect(res.status).to.equal(403);
        });
    });

    describe("GET /statuses endpoint", () => {
        it("should return 200 status code and list of statuses", async () => {
            const res = await agent(app).get("/statuses").set("Authorization", `Bearer ${tokensFixture.doctor}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(getStatusesFixture);
        });

        it("should return 403 unauthorized status when requesting user is wrong role", async () => {
            const res = await agent(app).get("/statuses").set("Authorization", `Bearer ${tokensFixture.admin}`);

            expect(res.status).to.equal(403);
        });
    });

    describe("PUT /statuses/:statusId/reviewed endpoint", () => {
        it("should return 204 status when setting isReviewed true", async () => {
            const res = await agent(app)
                .put("/statuses/1/reviewed")
                .send({
                    isReviewed: true,
                })
                .set("Authorization", `Bearer ${tokensFixture.doctor}`);

            expect(res.status).to.equal(204);
        });

        it("should return 204 status when setting isReviewed false", async () => {
            const res = await agent(app)
                .put("/statuses/1/reviewed")
                .send({
                    isReviewed: false,
                })
                .set("Authorization", `Bearer ${tokensFixture.doctor}`);

            expect(res.status).to.equal(204);
        });

        it("should return 403 unauthorized status when requesting user is not the correct role", async () => {
            const res = await agent(app)
                .put("/statuses/1/reviewed")
                .send({
                    isReviewed: true,
                })
                .set("Authorization", `Bearer ${tokensFixture.healthOfficial}`);

            expect(res.status).to.equal(403);
        });
    });
});
