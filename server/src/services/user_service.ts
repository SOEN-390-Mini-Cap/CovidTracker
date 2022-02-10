import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { UserRepository } from "../repositories/user_repository";
import { User } from "../entities/user";
import { Role, roleToIdMap } from "../entities/role";

@injectable()
export class UserService {
    constructor(
        @inject("Repository")
        @named("UserRepository")
        private readonly userRepository: UserRepository,
    ) {}

    async findUserByUserId(userId: number): Promise<User> {
        const user = await this.userRepository.findUserByUserId(userId);

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

    async findRoleByUserId(userId: number): Promise<Role> {
        const role = await this.userRepository.findRoleByUserId(userId);

        if (!role) {
            throw new Error("No role found");
        }

        return role;
    }
}
