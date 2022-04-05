import { expect } from "chai";
import { AppointmentController } from "../../../src/controllers/appointment_controller";
import { createSandbox, SinonStub } from "sinon";

describe("dashboard_controller.ts", () => {
    const appointmentService: any = {
        postAppointment: Function,
        getAppointments: Function,
    };
    const controller = new AppointmentController(appointmentService);

    let postAppointmentStub: SinonStub;
    let getAppointmentsStub: SinonStub;

    const sandbox = createSandbox();
    const res: any = {
        json: Function,
    };

    let req: any;
    let resJsonStub: SinonStub;

    beforeEach(() => {
        sandbox.restore();
        resJsonStub = sandbox.stub(res, "json");

        postAppointmentStub = sandbox.stub(appointmentService, "postAppointment");
        getAppointmentsStub = sandbox.stub(appointmentService, "getAppointments");
        req = {
            token: { doctorId: 5 },
            body: {
                patientId: 5,
                startDate: "2021-01-01",
                endDate: "2021-01-01",
                streetAddress: "value.streetAddress",
                streetAddressLineTwo: "value.streetAddressLineTwo",
                city: "QUEBEC",
                postalCode: "H9K 1S5",
                province: "QUEBEC",
            },
        };
    });

    describe("AppointmentController::postAppointment", () => {
        it("should call res.json with 201", async () => {
            await (controller as any).postAppointment(req, res);
            expect(resJsonStub.calledWith(201)).to.be.true;
        });

        it("should call res.json with 500", async () => {
            postAppointmentStub.rejects(new Error());
            await (controller as any).postAppointment(req, res);
            expect(resJsonStub.callCount).to.equal(1);
            expect(resJsonStub.calledWith(500)).to.be.true;
        });

        it("should call res.json with 400", async () => {
            req = {};
            await (controller as any).postAppointment(req, res);
            expect(resJsonStub.callCount).to.equal(1);
            expect(resJsonStub.calledWith(400)).to.be.true;
        });
    });

    describe("AppointmentController::getAppointments", () => {
        it("should call res.json with 200", async () => {
            await (controller as any).getAppointments(req, res);
            expect(resJsonStub.calledWith(200)).to.be.true;
        });

        it("should call res.json with 500", async () => {
            getAppointmentsStub.rejects(new Error());
            await (controller as any).getAppointments(req, res);
            expect(resJsonStub.callCount).to.equal(1);
            expect(resJsonStub.calledWith(500)).to.be.true;
        });
    });
});
