import { expect } from "chai";
import { createSandbox, SinonStub } from "sinon";
import { StatusController } from "../../../src/controllers/status_controller";

describe("status_controller.ts", () => {
    const statusService: any = {
        postStatus: Function,
        getStatus: Function,
        postStatusFields: Function,
        getStatusFields: Function,
    };
    const controller = new StatusController(statusService);

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

    describe("StatusController::postStatusFields", () => {
        let postStatusFieldsStub: SinonStub;

        beforeEach(() => {
            req = {
                token: {
                    userId: 1,
                },
                params: {
                    patientId: 2,
                },
                body: {
                    field1: true,
                    field2: false,
                },
            };

            postStatusFieldsStub = sandbox.stub(statusService, "postStatusFields");
        });

        it("should return status 201 when no errors", async () => {
            await (controller as any).postStatusFields(req, res);

            expect(
                postStatusFieldsStub.calledWithExactly(1, 2, {
                    field1: true,
                    field2: false,
                }),
            ).to.equal(true);
            expect(resJsonStub.calledWithExactly(201)).to.equal(true);
        });

        it("should return status 400 when no patient id", async () => {
            delete req.params.patientId;
            await (controller as any).postStatusFields(req, res);

            expect(postStatusFieldsStub.notCalled).to.equal(true);
            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 400 when no fields", async () => {
            delete req.body;
            await (controller as any).postStatusFields(req, res);

            expect(postStatusFieldsStub.notCalled).to.equal(true);
            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 400 when a field has a non boolean type", async () => {
            req.body.field3 = "test";
            await (controller as any).postStatusFields(req, res);

            expect(postStatusFieldsStub.notCalled).to.equal(true);
            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 500 if service throws an error", async () => {
            postStatusFieldsStub.rejects(new Error("error message"));

            await (controller as any).postStatusFields(req, res);

            expect(resJsonStub.calledWith(500)).to.equal(true);
        });
    });

    describe("StatusController::getStatusFields", () => {
        let getStatusFieldsStub: SinonStub;

        beforeEach(() => {
            req = {
                token: {
                    userId: 4,
                },
                params: {
                    patientId: 4,
                },
            };

            getStatusFieldsStub = sandbox.stub(statusService, "getStatusFields");
        });

        it("return status 200 when no errors", async () => {
            await (controller as any).getStatusFields(req, res);
            expect(getStatusFieldsStub.calledWithExactly(4, 4)).to.equal(true);
            expect(resJsonStub.calledWith(200)).to.equal(true);
        });

        it("return status 400 when patientId is not passed", async () => {
            delete req.params.patientId;
            await (controller as any).getStatusFields(req, res);
            expect(getStatusFieldsStub.notCalled).to.equal(true);
            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("return status 400 when invalid patientId is passed", async () => {
            req.params.patientId = "x";
            await (controller as any).getStatusFields(req, res);
            expect(getStatusFieldsStub.notCalled).to.equal(true);
            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("return status 500 when service throws an error", async () => {
            getStatusFieldsStub.rejects(new Error("error message"));

            await (controller as any).getStatusFields(req, res);
            expect(resJsonStub.calledWith(500)).to.equal(true);
        });
    });

    describe("StatusController::postStatus", () => {
        let postStatusStub: SinonStub;

        beforeEach(() => {
            req = {
                token: {
                    userId: 1,
                },
                params: {
                    patientId: 1,
                },
                body: {
                    field1: "val1",
                    field2: "val2",
                    field3: true,
                    field4: 10,
                },
            };

            postStatusStub = sandbox.stub(statusService, "postStatus");
        });

        it("should return status 201 when no errors", async () => {
            await (controller as any).postStatus(req, res);

            expect(
                postStatusStub.calledWithExactly(1, 1, {
                    field1: "val1",
                    field2: "val2",
                    field3: true,
                    field4: 10,
                }),
            ).to.equal(true);
            expect(resJsonStub.calledWithExactly(201)).to.equal(true);
        });

        it("should return status 400 when no patient id", async () => {
            delete req.params.patientId;
            await (controller as any).postStatus(req, res);

            expect(postStatusStub.notCalled).to.equal(true);
            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 400 when no status", async () => {
            delete req.body;
            await (controller as any).postStatus(req, res);

            expect(postStatusStub.notCalled).to.equal(true);
            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 500 if service throws an error", async () => {
            postStatusStub.rejects(new Error("error message"));

            await (controller as any).postStatus(req, res);

            expect(resJsonStub.calledWith(500)).to.equal(true);
        });
    });
});
