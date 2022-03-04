import { inject, injectable, named } from "inversify";
import { TestRepository } from "../repositories/test_repository";
import { Role } from "../entities/role";
import { AuthenticationService } from "./authentication_service";
import { AuthorizationError } from "../entities/errors/authorization_error";
import { RequestAddress } from "../entities/request/RequestAddress";
import { UserRepository } from "../repositories/user_repository";
import { TestResultType } from "../entities/test_result_type";
import { TestResult } from "../entities/test_result";
import { TestType } from "../entities/test_type";

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

    async postTestResult(
        result: TestResultType,
        testType: TestType,
        testDate: Date,
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

        const testResults: TestResult = {
            patientId,
            result,
            testType,
            testDate,
            addressId,
        };

        await this.testRepository.insertTestResult(testResults);
    }
}
