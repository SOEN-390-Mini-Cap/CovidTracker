import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { UserRepository } from "../repositories/user_repository";
import { User } from "../entities/user";
import { auth_RoleValidator } from "./auth_RoleValidator";
import { Role } from "../entities/role";
import { AuthorizationError } from "../entities/Error/AuthorizationError";

@injectable()
export class UserService {
    constructor(
        @inject("Repository")
        @named("UserRepository")
        private readonly userRepository: UserRepository,
    ) {}

    async findUserByUserId(userId: number): Promise<User> {
        const user = await this.userRepository.findUserByUserId(userId);
        if (!auth_RoleValidator(user, Object.values(Role))) {
            throw new AuthorizationError(401, "User not Authorized");
        }

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }
}
