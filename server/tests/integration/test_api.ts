import { agent } from "supertest";
import { app } from "../../src";
import { expect } from "chai";
import { restoreDb } from "../../db/restore_db";
import { seedDb } from "../../db/seed_db";

describe("test_controller.ts API", () => {
    const patient5Token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTY0NTEzNzk0Mn0.UcpnGpWBhdM4OEgKOrJEWXoknk9-I_2Cf19pJWkS5eY";
    const doctor1Token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY0NTk5NzI4Mn0.Is7O_xeaFrijN4uyM6tKDP7W9yzYabbugScC1w2Kn-s";
    const healthOfficialToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImlhdCI6MTY0NTk5NzA4OX0.c2zU_Z7lNO0vjX4dAE0Ara_LSP0YlIV-heWPa5kAQEs";

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
                    testDate: "05/11/1999",
                    streetAddress: "1001th street",
                    city: "Montreal",
                    postalCode: "A1B 2C3",
                    province: "Quebec",
                })
                .set("Authorization", `Bearer ${healthOfficialToken}`);

            expect(res.status).to.equal(201);
        });

        it("should return 201 status when test result is added by a doctor to his own patient successfully", async () => {
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
                .set("Authorization", `Bearer ${doctor1Token}`);

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
                .set("Authorization", `Bearer ${healthOfficialToken}`);

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
                .set("Authorization", `Bearer ${patient5Token}`);

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
                .set("Authorization", `Bearer ${doctor1Token}`);

            expect(res.status).to.equal(403);
        });
    });
});
