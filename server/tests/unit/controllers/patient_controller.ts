import { expect } from "chai";
import { createSandbox, SinonStub } from "sinon";
import { PatientController } from "../../../src/controllers/patient_controller";

describe("patient_controller.ts", () => {
    const patientService: any = {
        setStatusFields: Function,
        assignDoctor: Function,
        getPatientStatusFields: Function,
        submitStatus: Function,
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
        let assignDoctorStub: SinonStub;

        beforeEach(() => {
            req = {
                params: {
                    patientId: 1,
                },
                body: {
                    doctorId: 5,
                },
            };

            assignDoctorStub = sandbox.stub(patientService, "assignDoctor");
        });

        it("should assign doctorId to the given patient", async () => {
            await (controller as any).assignDoctor(req, res);

            expect(assignDoctorStub.calledWithExactly(1, 5)).to.equal(true);
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
            assignDoctorStub.rejects(new Error("error message"));

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

    describe("PatientController::getPatientStatusFields", () => {
        let getStatusFieldsStub: SinonStub;

        beforeEach(() => {
            req = {
                params: {
                    patientId: 4,
                },
            };

            getStatusFieldsStub = sandbox.stub(patientService, "getPatientStatusFields");
        });

        it("return status 201 when no errors", async () => {
            await (controller as any).getPatientStatusFields(req, res);
            expect(getStatusFieldsStub.calledWithExactly(4)).to.equal(true);
            expect(resJsonStub.calledWith(201)).to.equal(true);
        });

        it("return status 400 when patientId is not passed", async () => {
            delete req.params.patientId;
            await (controller as any).getPatientStatusFields(req, res);
            expect(getStatusFieldsStub.notCalled).to.equal(true);
            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("return status 400 when invalid patientId is passed", async () => {
            req.params.patientId = "x";
            await (controller as any).getPatientStatusFields(req, res);
            expect(getStatusFieldsStub.notCalled).to.equal(true);
            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("return status 500 when service throws an error", async () => {
            getStatusFieldsStub.rejects(new Error("error message"));

            await (controller as any).getPatientStatusFields(req, res);
            expect(resJsonStub.calledWith(500)).to.equal(true);
        });
    });

    describe("PatientController::submitStatus", () => {
        let submitStatusStub: SinonStub;

        beforeEach(() => {
            req = {
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

            submitStatusStub = sandbox.stub(patientService, "submitStatus");
        });

        it("should return status 201 when no errors", async () => {
            await (controller as any).submitStatus(req, res);

            expect(
                submitStatusStub.calledWithExactly(1, {
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
            await (controller as any).submitStatus(req, res);

            expect(submitStatusStub.notCalled).to.equal(true);
            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 400 when no status", async () => {
            delete req.body;
            await (controller as any).submitStatus(req, res);

            expect(submitStatusStub.notCalled).to.equal(true);
            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 500 if service throws an error", async () => {
            submitStatusStub.rejects(new Error("error message"));

            await (controller as any).submitStatus(req, res);

            expect(resJsonStub.calledWith(500)).to.equal(true);
        });
    });
});
