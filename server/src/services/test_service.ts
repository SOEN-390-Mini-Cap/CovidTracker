import { inject, injectable, named } from "inversify";
import { TestRepository } from "../repositories/test_repository";
import { Role } from "../entities/role";

@injectable()
export class TestService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor(@inject("Repository") @named("TestRepository") testRepository: TestRepository) {}

    async addTestResults(results: any, patientId: number, currentUserId: number, currentUserRole: Role) {
        return;
    }
}
