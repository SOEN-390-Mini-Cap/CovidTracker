import { agent } from "supertest";
import { app } from "../../src";
import { expect } from "chai";
import { restoreDb } from "../../db/restore_db";
import { seedDb } from "../../db/seed_db";

describe("patient_controller.ts API", () => {
    const adminToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTY0NTEzNzcwNH0.9z9YC_xaJGTBannHaHK3ZsG7TIbC5cGQROMUNzmlhYY";
    const patient5Token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTY0NTEzNzk0Mn0.UcpnGpWBhdM4OEgKOrJEWXoknk9-I_2Cf19pJWkS5eY";
    const healthOfficialToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImlhdCI6MTY0NTk5NzA4OX0.c2zU_Z7lNO0vjX4dAE0Ara_LSP0YlIV-heWPa5kAQEs";
    const doctor1Token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY0NTk5NzI4Mn0.Is7O_xeaFrijN4uyM6tKDP7W9yzYabbugScC1w2Kn-s";

    beforeEach(async () => {
        await restoreDb();
        await seedDb();
    });

    describe("POST /patients/:patientId/doctors endpoint", () => {
        it("should return 201 status", async () => {
            const res = await agent(app)
                .post("/patients/4/doctors")
                .send({
                    doctorId: 1,
                })
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).to.equal(201);
        });

        it("should return 500 status when admin tries to re-assign patient to new doctor", async () => {
            const res = await agent(app)
                .post("/patients/5/doctors")
                .send({
                    doctorId: 2,
                })
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).to.equal(500);
            expect(res.body.error).to.equal("Patient can not be assigned a new doctor");
        });

        it("should return 403 unauthorized status when user role is not admin", async () => {
            const res = await agent(app)
                .post("/patients/4/doctors")
                .send({
                    doctorId: 1,
                })
                .set("Authorization", `Bearer ${patient5Token}`);

            expect(res.status).to.equal(403);
        });
    });

    describe("GET /patients endpoint", () => {
        it("should return 200 status and list of all patients", async () => {
            const res = await agent(app).get("/patients").set("Authorization", `Bearer ${healthOfficialToken}`);

            expect(res.status).to.equal(200);
            expect(res.body.length).to.deep.equal(3);
        });

        it("should return 200 status and list of patients for a doctor", async () => {
            const res = await agent(app).get("/patients").set("Authorization", `Bearer ${doctor1Token}`);

            const { account, address, ...user } = res.body[0];

            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(1);
            expect(account.userId).to.equal(3);
            expect(account.email).to.equal("test3@test.com");
            expect(address).to.deep.equal({
                addressId: 2,
                streetAddress: "1001th street",
                streetAddressLineTwo: "",
                city: "Montreal",
                province: "Quebec",
                postalCode: "A1B 2C3",
                country: "Canada",
            });
            expect(user).to.deep.equal({
                firstName: "john",
                lastName: "smith",
                phoneNumber: "514-245-6532",
                gender: "MALE",
                dateOfBirth: "2000-01-19T02:26:39.131Z",
                role: "PATIENT",
            });
        });

        it("should return 403 unauthorized status when user role is accepted", async () => {
            const res = await agent(app).get("/patients").set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).to.equal(403);
        });
    });
});
