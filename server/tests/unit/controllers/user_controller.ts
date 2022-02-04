import { expect } from "chai";
import { createSandbox, SinonStub } from "sinon";
import { UserController } from "../../../src/controllers/user_controller";

describe("user_controller.ts", () => {
    const userService: any = {
        findUserByUserId: Function,
    };
    const controller = new UserController(userService);

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

    describe("UserController::me", () => {
        let findUserByUserIdStub: SinonStub;

        beforeEach(() => {
            req = {
                token: {
                    userId: 1,
                },
            };

            findUserByUserIdStub = sandbox.stub(userService, "findUserByUserId");
            findUserByUserIdStub.withArgs(1).resolves(mockUser);
        });

        it("should return user when user is found by id", async () => {
            await (controller as any).me(req, res);

            expect(findUserByUserIdStub.calledWithExactly(1)).to.equal(true);
            expect(resJsonStub.calledWithExactly(200, mockExpectedUser)).to.equal(true);
        });

        it("should return status 500 if service throws an error", async () => {
            req.token.userId = 2;
            findUserByUserIdStub.rejects(new Error("error message"));

            await (controller as any).me(req, res);

            expect(resJsonStub.calledWith(500)).to.equal(true);
        });
    });
});

const mockUser = {
    userId: 1,
    email: "test3@test.com",
    password: "password",
    firstName: "john",
    lastName: "smith",
    phoneNumber: "514-245-6532",
    gender: "MALE",
    dateOfBirth: "2000-01-19T02:26:39.131Z",
    createdOn: "2022-01-28T01:48:02.322Z",
    roles: ["USER", "PATIENT"],
    address: {
        addressId: 2,
        userId: 1,
        streetAddress: "1001th street",
        streetAddressLineTwo: "",
        city: "Montreal",
        province: "Quebec",
        postalCode: "A1B 2C3",
        country: "Canada",
    },
};

const mockExpectedUser = {
    userId: 1,
    email: "test3@test.com",
    password: "",
    firstName: "john",
    lastName: "smith",
    phoneNumber: "514-245-6532",
    gender: "MALE",
    dateOfBirth: "2000-01-19T02:26:39.131Z",
    createdOn: "2022-01-28T01:48:02.322Z",
    roles: ["USER", "PATIENT"],
    address: {
        addressId: 2,
        userId: 1,
        streetAddress: "1001th street",
        streetAddressLineTwo: "",
        city: "Montreal",
        province: "Quebec",
        postalCode: "A1B 2C3",
        country: "Canada",
    },
};
