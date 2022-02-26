import { expect } from "chai";
import { createSandbox, SinonStub } from "sinon";
import { PatientController } from "../../../src/controllers/patient_controller";

describe("patient_controller.ts", () => {
    const patientService: any = {
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
});
