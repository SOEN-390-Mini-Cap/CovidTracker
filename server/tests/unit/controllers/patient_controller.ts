import { expect } from "chai";
import { createSandbox, SinonStub } from "sinon";
import { PatientController } from "../../../src/controllers/patient_controller";

describe("patient_controller.ts", () => {
    const patientService: any = {
        setStatusFields: Function,
        assignDoctor: Function,
    };
    const controller = new PatientController(patientService);

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

    describe("PatientController::assignDoctor", () => {
        let assignDoctor: SinonStub;

        beforeEach(() => {
            req = {
                params: {
                    patientId: 1,
                },
                body: {
                    doctorId: 5,
                },
            };

            assignDoctor = sandbox.stub(patientService, "assignDoctor");
        });

        it("should assign doctorId to the given patient", async () => {
            await (controller as any).assignDoctor(req, res);

            expect(assignDoctor.calledWithExactly(1, 5)).to.equal(true);
            expect(resJsonStub.calledWith(201)).to.equal(true);
        });

        it("should return status 400 if doctorId is not passed", async () => {
            delete req.body.doctorId;
            await (controller as any).assignDoctor(req, res);

            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 400 if patientId is not passed", async () => {
            delete req.params.patientId;
            await (controller as any).assignDoctor(req, res);
            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 500 if service throws an error", async () => {
            assignDoctor.rejects(new Error("error message"));

            await (controller as any).assignDoctor(req, res);

            expect(resJsonStub.calledWith(500)).to.equal(true);
        });
    });

    describe("PatientController::setStatusFields", () => {
        let setStatusFieldsStub: SinonStub;

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

            setStatusFieldsStub = sandbox.stub(patientService, "setStatusFields");
        });

        it("should return status 201 when no errors", async () => {
            await (controller as any).setStatusFields(req, res);

            expect(
                setStatusFieldsStub.calledWithExactly(1, 2, {
                    field1: true,
                    field2: false,
                }),
            ).to.equal(true);
            expect(resJsonStub.calledWithExactly(201)).to.equal(true);
        });

        it("should return status 400 when no patient id", async () => {
            delete req.params.patientId;
            await (controller as any).setStatusFields(req, res);

            expect(setStatusFieldsStub.notCalled).to.equal(true);
            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 400 when no fields", async () => {
            delete req.body;
            await (controller as any).setStatusFields(req, res);

            expect(setStatusFieldsStub.notCalled).to.equal(true);
            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 400 when a field has a non boolean type", async () => {
            req.body.field3 = "test";
            await (controller as any).setStatusFields(req, res);

            expect(setStatusFieldsStub.notCalled).to.equal(true);
            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 500 if service throws an error", async () => {
            setStatusFieldsStub.rejects(new Error("error message"));

            await (controller as any).setStatusFields(req, res);

            expect(resJsonStub.calledWith(500)).to.equal(true);
        });
    });
});
