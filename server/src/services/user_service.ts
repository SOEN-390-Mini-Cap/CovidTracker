import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { UserRepository } from "../repositories/user_repository";
import { User } from "../entities/user";
import { roleValidator } from "./role_validator";
import { ROLES } from "../entities/role";
import { AuthorizationError } from "../entities/errors/authorization_error";

@injectable()
export class UserService {
    constructor(
        @inject("Repository")
        @named("UserRepository")
        private readonly userRepository: UserRepository,
    ) {}

    async findUserByUserId(userId: number): Promise<User> {
        const user = await this.userRepository.findUserByUserId(userId);
        if (!roleValidator(user, ROLES)) {
            throw new AuthorizationError();
        }

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }
}
