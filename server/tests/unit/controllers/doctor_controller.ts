import { expect } from "chai";
import { createSandbox, SinonStub } from "sinon";
import { DoctorController } from "../../../src/controllers/doctor_controller";
import { PatientCounts } from "../../../src/entities/patient_counts";

describe("doctor_controller.ts", () => {
    const doctorService: any = {
        getPatientCounts: Function,
    };
    const controller = new DoctorController(doctorService);

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

    describe("DoctorController::setStatusFields", () => {
        let getPatientCountsStub: SinonStub;

        beforeEach(() => {
            req = {
                token: {
                    userId: 1,
                },
            };

            getPatientCountsStub = sandbox.stub(doctorService, "getPatientCounts");
            getPatientCountsStub.resolves(mockPatientCounts);
        });

        it("should return status 200 with correct patient counts", async () => {
            await (controller as any).getPatientCounts(req, res);

            expect(getPatientCountsStub.calledOnce).to.equal(true);
            expect(resJsonStub.calledWithExactly(200, mockPatientCounts)).to.equal(true);
        });

        it("should return status 500 if service throws an error", async () => {
            getPatientCountsStub.rejects(new Error("error message"));

            await (controller as any).getPatientCounts(req, res);

            expect(resJsonStub.calledWith(500)).to.equal(true);
        });
    });
});

const mockPatientCounts: PatientCounts = [
    {
        doctorId: 1,
        doctorName: "doctor2 smith",
        doctorEmail: "test6@test.com",
        numberOfPatients: 2,
    },
    {
        doctorId: 2,
        doctorName: "doctor1 smith",
        doctorEmail: "test3@test.com",
        numberOfPatients: 1,
    },
];
