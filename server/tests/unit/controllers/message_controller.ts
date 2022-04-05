import { expect } from "chai";
import { createSandbox, SinonStub } from "sinon";
import { MessageController } from "../../../src/controllers/message_controller";

describe("message_controller.ts", () => {
    const messageService: any = {
        postMessage: Function,
        getMessagesAdapter: Function,
        getChatsAdapter: Function,
    };
    const controller = new MessageController(messageService);

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

    describe("MessageController::postMessage", () => {
        let postMessageStub: SinonStub;

        beforeEach(() => {
            req = {
                token: {
                    userId: 3,
                },
                body: {
                    to: 5,
                    body: "text",
                    isPriority: true,
                },
            };

            postMessageStub = sandbox.stub(messageService, "postMessage");
        });

        it("should return status 201 if request is valid", async () => {
            await (controller as any).postMessage(req, res);

            expect(postMessageStub.calledOnce).to.equal(true);
            expect(resJsonStub.calledWith(201)).to.equal(true);
        });

        it("should return status 400 if data is invalid", async () => {
            delete req.body.to;
            await (controller as any).postMessage(req, res);

            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 500 if service throws an error", async () => {
            postMessageStub.rejects(new Error());
            await (controller as any).postMessage(req, res);
            expect(resJsonStub.calledWith(500)).to.equal(true);
        });
    });

    describe("MessageController::getMessages", () => {
        let getMessagesAdapterStub: SinonStub;

        beforeEach(() => {
            req = {
                query: {
                    userId: 3,
                },
            };

            getMessagesAdapterStub = sandbox.stub(messageService, "getMessagesAdapter");
        });

        it("should return status 200 if request is valid", async () => {
            await (controller as any).getMessages(req, res);

            expect(getMessagesAdapterStub.calledOnce).to.equal(true);
            expect(resJsonStub.calledWith(200)).to.equal(true);
        });

        it("should return status 400 if data is invalid", async () => {
            delete req.query.userId;
            await (controller as any).getMessages(req, res);
            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 500 if service throws an error", async () => {
            getMessagesAdapterStub.rejects(new Error());
            await (controller as any).getMessages(req, res);
            expect(resJsonStub.calledWith(500)).to.equal(true);
        });
    });

    describe("MessageController::getChats", () => {
        let getChatsAdapterStub: SinonStub;

        beforeEach(() => {
            req = {
                token: {
                    userId: 3,
                },
            };

            getChatsAdapterStub = sandbox.stub(messageService, "getChatsAdapter");
        });

        it("should return status 200 if request is valid", async () => {
            await (controller as any).getChats(req, res);

            expect(getChatsAdapterStub.calledOnce).to.equal(true);
            expect(resJsonStub.calledWith(200)).to.equal(true);
        });

        it("should return status 500 if service throws an error", async () => {
            getChatsAdapterStub.rejects(new Error());
            await (controller as any).getChats(req, res);
            expect(resJsonStub.calledWith(500)).to.equal(true);
        });
    });
});
