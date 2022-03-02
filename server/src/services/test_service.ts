import { inject, injectable, named } from "inversify";
import { TestRepository } from "../repositories/test_repository";
import { Role } from "../entities/role";
import { TestResults } from "../entities/test";
import { AuthenticationService } from "./authentication_service";
import { AuthorizationError } from "../entities/errors/authorization_error";
import { RequestAddress } from "../entities/request/RequestAddress";
import { UserRepository } from "../repositories/user_repository";

@injectable()
export class TestService {
    constructor(
        @inject("Repository")
        @named("TestRepository")
        private readonly testRepository: TestRepository,
        @inject("Repository")
        @named("UserRepository")
        private readonly userRepository: UserRepository,
        @inject("Service")
        @named("AuthenticationService")
        private readonly authenticationService: AuthenticationService,
    ) {}

    async addTestResults(
        testResult: string,
        typeOfTest: string,
        dateOfTest: Date,
        addressData: RequestAddress,
        patientId: number,
        currentUserId: number,
        currentUserRole: Role,
    ): Promise<void> {
        const userAccess =
            (await this.authenticationService.isUserPatientOfDoctor(patientId, currentUserId)) ||
            currentUserRole === Role.HEALTH_OFFICIAL;

        if (!userAccess) {
            throw new AuthorizationError();
        }

        const addressId = await this.userRepository.addAddress(addressData);

        const testResults: TestResults = { patientId, testResult, typeOfTest, dateOfTest, addressId };

        await this.testRepository.addTestResult(testResults);
    }
}
