import { expect } from "chai";
import { createSandbox, SinonStub } from "sinon";
import { LocationReportController } from "../../../src/controllers/location_report_controller";

describe("location_report_controller.ts", () => {
    const locationReportService: any = {
        postLocationReport: Function,
    };
    const controller = new LocationReportController(locationReportService);

    const sandbox = createSandbox();

    let req: any;
    let res: any;
    let resJsonStub: SinonStub;

    beforeEach(() => {
        res = {
            json: Function,
        };

        sandbox.restore();
        resJsonStub = sandbox.stub(res, "json");
    });

    describe("LocationReportController::postLocationReport", () => {
        let postLocationReportStub: SinonStub;

        beforeEach(() => {
            req = {
                token: {
                    userId: 3,
                },
                body: {
                    createdOn: "2021-01-01",
                    streetAddress: "text",
                    streetAddressLineTwo: "test",
                    city: "test",
                    postalCode: "test",
                    province: "test",
                },
            };

            postLocationReportStub = sandbox.stub(locationReportService, "postLocationReport");
        });

        it("should return status 201 if request is valid", async () => {
            await (controller as any).postLocationReport(req, res);

            expect(postLocationReportStub.calledOnce).to.equal(true);
            expect(resJsonStub.calledWith(201)).to.equal(true);
        });

        it("should return status 400 if data is invalid", async () => {
            delete req.body.createdOn;
            await (controller as any).postLocationReport(req, res);

            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 500 if service throws an error", async () => {
            postLocationReportStub.rejects(new Error());
            await (controller as any).postLocationReport(req, res);
            expect(resJsonStub.calledWith(500)).to.equal(true);
        });
    });
});
