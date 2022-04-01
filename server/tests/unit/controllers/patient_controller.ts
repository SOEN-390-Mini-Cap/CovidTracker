import { expect } from "chai";
import { createSandbox, SinonStub } from "sinon";
import { PatientController } from "../../../src/controllers/patient_controller";

describe("patient_controller.ts", () => {
    const patientService: any = {
        assignDoctor: Function,
        getPatientsStrategy: Function,
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

    describe("PatientController::getPatients", () => {
        let getPatientsStrategyStub: SinonStub;

        beforeEach(() => {
            req = {
                query: {
                    status: "POSITIVE",
                    testDateFrom: "2022-01-01",
                    testDateTo: "2022-01-01",
                },
            };

            getPatientsStrategyStub = sandbox.stub(patientService, "getPatientsStrategy");
        });

        it("getPatientsStrategy should be called if data is valid", async () => {
            await (controller as any).getPatients(req, res);
            expect(getPatientsStrategyStub.called).to.equal(true);
        });

        it("getPatientsStrategy should be called if data is valid", async () => {
            req.query.traceTarget = 1;
            await (controller as any).getPatients(req, res);
            expect(getPatientsStrategyStub.called).to.equal(true);
        });

        it("should return status 400 if data is invalid", async () => {
            req.query.status = "x";
            await (controller as any).getPatients(req, res);
            expect(getPatientsStrategyStub.notCalled).to.equal(true);
            expect(resJsonStub.calledOnceWith(400)).to.equal(true);
        });
    });
});
