import { expect } from "chai";
import { createSandbox, SinonStub } from "sinon";
import { AuthenticationController } from "../../../src/controllers/authentication_controller";
import { Gender } from "../../../src/entities/gender";

describe("authentication_controller.ts", () => {
    const authenticationService: any = {
        signUp: Function,
        signIn: Function,
    };
    const controller = new AuthenticationController(authenticationService);

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

    describe("AuthenticationController::signUp", () => {
        let signUpStub: SinonStub;

        beforeEach(() => {
            req = {
                body: {
                    firstName: "fname",
                    lastName: "lname",
                    phoneNumber: "1231231234",
                    gender: Gender.MALE,
                    dateOfBirth: "2000-01-25T18:09:13.127Z",
                    streetAddress: "1000th place",
                    city: "city name",
                    postalCode: "A1B 2C3",
                    province: "Quebec",
                    email: "test@email.com",
                    password: "Test123!",
                },
            };

            signUpStub = sandbox.stub(authenticationService, "signUp");
            signUpStub.resolves("secret-token");
        });

        it("should return jwt token when sign up is successful", async () => {
            await (controller as any).signUp(req, res);

            expect(
                resJsonStub.calledWithExactly(201, {
                    token: "secret-token",
                }),
            ).to.equal(true);
        });

        it("should return status 500 if service throws an error", async () => {
            signUpStub.rejects(new Error("error message"));

            await (controller as any).signUp(req, res);

            expect(resJsonStub.calledWith(500)).to.equal(true);
        });

        it("should return status 400 when phone number is incorrect length", async () => {
            req.body.phoneNumber = "123";

            await (controller as any).signUp(req, res);

            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 400 when gender is not in enum", async () => {
            req.body.gender = "test";

            await (controller as any).signUp(req, res);

            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 400 when email is missing", async () => {
            delete req.body.email;

            await (controller as any).signUp(req, res);

            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 400 when password is missing", async () => {
            delete req.body.password;

            await (controller as any).signUp(req, res);

            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 400 when password does not follow correct format", async () => {
            req.body.password = "test123";

            await (controller as any).signUp(req, res);

            expect(resJsonStub.calledWith(400)).to.equal(true);
        });
    });

    describe("AuthenticationController::signIn", () => {
        let signInStub: SinonStub;

        beforeEach(() => {
            req = {
                body: {
                    email: "test@email.com",
                    password: "Test123!",
                },
            };

            signInStub = sandbox.stub(authenticationService, "signIn");
            signInStub.resolves("secret-token");
        });

        it("should return jwt token when authentication is successful", async () => {
            await (controller as any).signIn(req, res);

            expect(
                resJsonStub.calledWithExactly(200, {
                    token: "secret-token",
                }),
            ).to.equal(true);
        });

        it("should return status 500 if service throws an error", async () => {
            signInStub.rejects(new Error("error message"));

            await (controller as any).signIn(req, res);

            expect(resJsonStub.calledWith(500)).to.equal(true);
        });

        it("should return status 400 when email is missing", async () => {
            delete req.body.email;

            await (controller as any).signIn(req, res);

            expect(resJsonStub.calledWith(400)).to.equal(true);
        });

        it("should return status 400 when password is missing", async () => {
            delete req.body.password;

            await (controller as any).signIn(req, res);

            expect(resJsonStub.calledWith(400)).to.equal(true);
        });
    });
});
