import { createSandbox, SinonStub } from "sinon";
import { expect } from "chai";
import { TestController } from "../../../src/controllers/test_controller";
import { Role } from "../../../src/entities/role";
import { any } from "joi";
describe("test_controller.ts", () => {
    const testService: any = {
        postTestResult: Function,
    };

    const controller = new TestController(testService);

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

    describe("test_controller::postTestResult", () => {
        let postTestResultStub: SinonStub;

        beforeEach(() => {
            req = {
                token: {
                    userId: 6,
                    userRole: Role.HEALTH_OFFICIAL,
                },
                body: {
                    result: "POSITIVE",
                    testType: "NASAL",
                    testDate: "05/11/1999",
                    streetAddress: "1001th street",
                    city: "Montreal",
                    patientId: 3,
                    postalCode: "A1B 2C3",
                    province: "Quebec",
                },
            };

            postTestResultStub = sandbox.stub(testService, "postTestResult");
            postTestResultStub.resolves();
        });

        it("should return status 201 if no error", async () => {
            await (controller as any).postTestResult(req, res);
            expect(postTestResultStub.calledOnce).to.equal(true);
            expect(resJsonStub.calledWithExactly(201)).to.equal(true);
        });

        it("should return status 400 if body is not as expected", async () => {
            req.body.result = "test";
            await (controller as any).postTestResult(req, res);
            expect(postTestResultStub.notCalled).to.equal(true);
            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 500 if service throws error", async () => {
            postTestResultStub.throws(new Error());
            await (controller as any).postTestResult(req, res);
            expect(resJsonStub.calledWith(500)).to.equal(true);
        });
    });
});
