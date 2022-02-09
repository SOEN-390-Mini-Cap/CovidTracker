import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { UserRepository } from "../repositories/user_repository";
import { User } from "../entities/user";
import { roleValidator } from "./role_validator";
import { Role, ROLES, roleToIdMap } from "../entities/role";
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

    async assignRole(userId: number, role: Role): Promise<void> {
        const roleId = roleToIdMap.get(role);
        const isUpdated = !!(await this.userRepository.updateUserRole(userId, roleId));

        if (!isUpdated) {
            throw new Error("User role is already assigned");
        }
    }

    async findUserRoleById(userId: number): Promise<Role> {
        const role = await this.userRepository.findUserRoleByUserId(userId);

        if (!role) {
            throw new Error("No role found");
        }

        return role;
    }
}
