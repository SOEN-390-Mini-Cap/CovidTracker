import { agent } from "supertest";
import { app } from "../../src";
import { expect } from "chai";

describe("base_controller.ts API", () => {
    describe("index endpoint", () => {
        it("should return 200 status ok", async () => {
            const res = await agent(app).get("/");

            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
                status: "ok",
            });
        });
    });
});
