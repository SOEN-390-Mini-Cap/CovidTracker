import { expect } from "chai";
import { BaseController } from "../../../src/controllers/BaseController";
import { createSandbox, SinonStub } from "sinon";

describe("BaseController.ts", () => {
    const controller = new BaseController();
    const sandbox = createSandbox();
    const res: any = {
        json: Function,
    };

    let req: any;
    let resJsonStub: SinonStub;

    beforeEach(() => {
        sandbox.restore();
        resJsonStub = sandbox.stub(res, "json");

        req = {};
    });

    describe("BaseController::index", () => {
        it("should call res.json with 200 status ok", async () => {
            await (controller as any).index(req, res);

            expect(resJsonStub.callCount).to.equal(1);
            expect(
                resJsonStub.calledWith(200, {
                    status: "ok",
                }),
            ).to.be.true;
        });
    });
});
