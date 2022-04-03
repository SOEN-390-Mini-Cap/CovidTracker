import { agent } from "supertest";
import { app } from "../../src";
import { expect } from "chai";
import { restoreDb } from "../../db/restore_db";
import { seedDb } from "../../db/seed_db";
import { tokensFixture } from "../fixtures/tokens_fixture";

describe("doctor_controller.ts API", () => {
    beforeEach(async () => {
        await restoreDb();
        await seedDb();
    });

    describe("GET /doctors/patient_counts endpoint", () => {
        it("should return 200 status and patient counts", async () => {
            const res = await agent(app)
                .get("/doctors/patient_counts")
                .set("Authorization", `Bearer ${tokensFixture.admin}`);

            expect(res.status).to.equal(200);
        });
    });
});
