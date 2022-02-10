import { expect } from "chai";
import { createSandbox, SinonStub } from "sinon";
import { UserController } from "../../../src/controllers/user_controller";
import { User } from "../../../src/entities/user";
import { Gender } from "../../../src/entities/gender";
import { Role } from "../../../src/entities/role";

describe("user_controller.ts", () => {
    const userService: any = {
        findUserByUserId: Function,
        assignRole: Function,
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

    describe("UserController::assignRole", () => {
        let assignRoleStub: SinonStub;

        beforeEach(() => {
            req = {
                token: {
                    userId: 1,
                    role: Role.ADMIN,
                },
                body: {
                    role: Role.PATIENT,
                },
                params: {
                    userId: 1,
                },
            };

            assignRoleStub = sandbox.stub(userService, "assignRole");
        });

        it("should return status 204 if no errors", async () => {
            await (controller as any).assignRole(req, res);

            expect(assignRoleStub.calledWithExactly(1, Role.PATIENT)).to.equal(true);
            expect(resJsonStub.calledWithExactly(204)).to.equal(true);
        });

        it("should return status 500 if service throws an error", async () => {
            assignRoleStub.rejects(new Error("error message"));

            await (controller as any).assignRole(req, res);

            expect(resJsonStub.calledWith(500)).to.equal(true);
        });
    });
});

const mockUser: User = {
    firstName: "john",
    lastName: "smith",
    phoneNumber: "514-245-6532",
    gender: Gender.MALE,
    dateOfBirth: new Date("2000-01-19T02:26:39.131Z"),
    role: Role.USER,
    address: {
        addressId: 2,
        streetAddress: "1001th street",
        streetAddressLineTwo: "",
        city: "Montreal",
        province: "Quebec",
        postalCode: "A1B 2C3",
        country: "Canada",
    },
    account: {
        userId: 1,
        email: "test3@test.com",
        password: "password",
        createdOn: new Date("2022-01-28T01:48:02.322Z"),
    },
};

const mockExpectedUser: User = {
    firstName: "john",
    lastName: "smith",
    phoneNumber: "514-245-6532",
    gender: Gender.MALE,
    dateOfBirth: new Date("2000-01-19T02:26:39.131Z"),
    role: Role.USER,
    address: {
        addressId: 2,
        streetAddress: "1001th street",
        streetAddressLineTwo: "",
        city: "Montreal",
        province: "Quebec",
        postalCode: "A1B 2C3",
        country: "Canada",
    },
    account: {
        userId: 1,
        email: "test3@test.com",
        password: "",
        createdOn: new Date("2022-01-28T01:48:02.322Z"),
    },
};
