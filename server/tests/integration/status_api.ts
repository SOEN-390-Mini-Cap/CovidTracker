import { agent } from "supertest";
import { app } from "../../src";
import { expect } from "chai";
import { restoreDb } from "../../db/restore_db";
import { seedDb } from "../../db/seed_db";

describe("status_controller.ts API", () => {
    const patient5Token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTY0NTEzNzk0Mn0.UcpnGpWBhdM4OEgKOrJEWXoknk9-I_2Cf19pJWkS5eY";
    const patient3Token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY0NTg1NTI0NX0.ieUOhLZclBcogP6SBReqAf5ELNoWclub7sjnEm-q6k4";
    const doctor1Token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY0NTk5NzI4Mn0.Is7O_xeaFrijN4uyM6tKDP7W9yzYabbugScC1w2Kn-s";
    const healthOfficialToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImlhdCI6MTY0NTk5NzA4OX0.c2zU_Z7lNO0vjX4dAE0Ara_LSP0YlIV-heWPa5kAQEs";

    beforeEach(async () => {
        await restoreDb();
        await seedDb();
    });

    describe("POST /statuses/patients/:patientId endpoint", () => {
        it("should return 201 status", async () => {
            const res = await agent(app)
                .post("/statuses/patients/5")
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
                .set("Authorization", `Bearer ${patient5Token}`);

            expect(res.status).to.equal(201);
        });

        it("should return 500 status when patient tries to submit 2 statuses on the same calendar day", async () => {
            await agent(app)
                .post("/statuses/patients/5")
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
                .set("Authorization", `Bearer ${patient5Token}`);
            const res = await agent(app)
                .post("/statuses/patients/5")
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
                .set("Authorization", `Bearer ${patient5Token}`);

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
                .set("Authorization", `Bearer ${patient5Token}`);

            expect(res.status).to.equal(500);
            expect(res.body.error).to.equal("Status is malformed");
        });

        it("should return 403 unauthorized status when requesting patientId is not the same as the logged in patient", async () => {
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
                .set("Authorization", `Bearer ${patient5Token}`);

            expect(res.status).to.equal(403);
        });
    });

    describe("GET /statuses/patients/:patientId endpoint", () => {
        it("should return 200 status code and list of patients statuses", async () => {
            const res = await agent(app).get("/statuses/patients/3").set("Authorization", `Bearer ${patient3Token}`);

            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(1);
            expect(res.body[0].patientId).to.equal(3);
            expect(res.body[0].status).to.deep.equal({
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
            });
        });

        it("should return 200 status code and empty list of patients statuses", async () => {
            const res = await agent(app).get("/statuses/patients/5").set("Authorization", `Bearer ${patient5Token}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal([]);
        });

        it("should return 403 unauthorized status when requesting patientId is not the same as the logged in patient", async () => {
            const res = await agent(app).get("/statuses/patients/5").set("Authorization", `Bearer ${patient3Token}`);

            expect(res.status).to.equal(403);
        });
    });

    describe("GET /statuses endpoint", () => {
        it("should return 200 status code and list of statuses", async () => {
            const res = await agent(app).get("/statuses").set("Authorization", `Bearer ${doctor1Token}`);
            const { statusId, patientId, status } = res.body[0];

            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(1);
            expect(statusId).to.equal(1);
            expect(patientId).to.equal(3);
            expect(status).to.deep.equal({
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
            });
        });

        it("should return 403 unauthorized status when requesting user is wrong role", async () => {
            const res = await agent(app).get("/statuses").set("Authorization", `Bearer ${healthOfficialToken}`);

            expect(res.status).to.equal(403);
        });
    });
});
