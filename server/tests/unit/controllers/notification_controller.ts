import { expect } from "chai";
import { createSandbox, SinonStub } from "sinon";
import { NotificationController } from "../../../src/controllers/notification_controller";

describe("notification_controller.ts", () => {
    const notificationService: any = {
        sendEmail: Function,
        sendSMS: Function,
    };
    const controller = new NotificationController(notificationService);

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

    describe("NotificationController::postSMS", () => {
        let sendSMSStub: SinonStub;

        beforeEach(() => {
            req = {
                body: {
                    userId: 5,
                    body: "text",
                },
            };

            sendSMSStub = sandbox.stub(notificationService, "sendSMS");
        });

        it("should return status 201 if request is valid", async () => {
            await (controller as any).postSMS(req, res);

            expect(sendSMSStub.calledOnce).to.equal(true);
            expect(resJsonStub.calledWith(201)).to.equal(true);
        });

        it("should return status 400 if data is invalid", async () => {
            delete req.body.userId;
            await (controller as any).postSMS(req, res);

            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 500 if service throws an error", async () => {
            sendSMSStub.rejects(new Error());
            await (controller as any).postSMS(req, res);
            expect(resJsonStub.calledWith(500)).to.equal(true);
        });
    });

    describe("NotificationController::postEmail", () => {
        let postEmailStub: SinonStub;

        beforeEach(() => {
            req = {
                body: {
                    userId: 5,
                    body: "text",
                    subject: "text",
                },
            };

            postEmailStub = sandbox.stub(notificationService, "sendEmail");
        });

        it("should return status 201 if request is valid", async () => {
            await (controller as any).postEmail(req, res);

            expect(postEmailStub.calledOnce).to.equal(true);
            expect(resJsonStub.calledWith(201)).to.equal(true);
        });

        it("should return status 400 if data is invalid", async () => {
            delete req.body.userId;
            await (controller as any).postEmail(req, res);

            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 500 if service throws an error", async () => {
            postEmailStub.rejects(new Error());
            await (controller as any).postEmail(req, res);
            expect(resJsonStub.calledWith(500)).to.equal(true);
        });
    });
});
