import { agent } from "supertest";
import { app } from "../../src";
import { expect } from "chai";
import { restoreDb } from "../../db/restore_db";
import { seedDb } from "../../db/seed_db";
import { tokensFixture } from "../fixtures/tokens_fixture";

describe("location_report_controller.ts API", () => {
    beforeEach(async () => {
        await restoreDb();
        await seedDb();
    });

    describe("POST /location_reports endpoint", () => {
        it("should return 201 status and create location report", async () => {
            const res = await agent(app)
                .post("/location_reports")
                .send({
                    createdOn: "2022-01-25 05:02:32.162000 +00:00",
                    streetAddress: "1000th place",
                    streetAddressLineTwo: "",
                    city: "city name",
                    postalCode: "A1B 2C3",
                    province: "Quebec",
                })
                .set("Authorization", `Bearer ${tokensFixture.patient3}`);

            expect(res.status).to.equal(201);
        });
    });
});
