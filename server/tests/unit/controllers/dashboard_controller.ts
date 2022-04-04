import { expect } from "chai";
import { DashboardController } from "../../../src/controllers/dashboard_controller";
import { createSandbox, SinonStub } from "sinon";
import { DashboardStrategy } from "../../../src/services/dashboard/dashboard_strategy";

describe("dashboard_controller.ts", () => {
    const dashboardStrategy: any = {
        dashboardStrategyFactory: Function,
    };
    const controller = new DashboardController(dashboardStrategy);

    let dashboardStrategyFactoryStub: SinonStub;

    const sandbox = createSandbox();
    const res: any = {
        json: Function,
    };

    let req: any;
    let resJsonStub: SinonStub;

    beforeEach(() => {
        sandbox.restore();
        resJsonStub = sandbox.stub(res, "json");

        dashboardStrategyFactoryStub = sandbox.stub(dashboardStrategy, "dashboardStrategyFactory");
        req = {};
    });

    describe("DashboardController::getDashboards", () => {
        it("should call res.json with 200", async () => {
            dashboardStrategyFactoryStub.returns(() => {
                return null;
            });
            await (controller as any).getDashboards(req, res);
            expect(resJsonStub.calledWith(200)).to.be.true;
        });

        it("should call res.json with 500", async () => {
            dashboardStrategyFactoryStub.rejects(new Error());
            await (controller as any).getDashboards(req, res);
            expect(resJsonStub.callCount).to.equal(1);
            expect(resJsonStub.calledWith(500)).to.be.true;
        });
    });
});
