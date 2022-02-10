import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { UserRepository } from "../repositories/user_repository";
import { User } from "../entities/user";
import { Role } from "../entities/role";

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

    async findRoleByUserId(userId: number): Promise<Role> {
        const role = await this.userRepository.findRoleByUserId(userId);

        if (!role) {
            throw new Error("No role found");
        }

        return role;
    }

    async assignRoleStrategy(userId: number, role: Role): Promise<void> {
        const isUpdated = !!(await this.userRepository.updateUserRole(userId, role));

        if (!isUpdated) {
            throw new Error("User role is already assigned");
        }

        switch (role) {
            case Role.PATIENT:
                await this.userRepository.addPatient(userId);
                return;
            case Role.DOCTOR:
                await this.userRepository.addDoctor(userId);
                return;
            case Role.ADMIN:
                await this.userRepository.addAdmin(userId);
                return;
            case Role.HEALTH_OFFICIAL:
                await this.userRepository.addHealthOfficial(userId);
                return;
            case Role.IMMIGRATION_OFFICER:
                await this.userRepository.addImmigrationOfficer(userId);
                return;
        }
    }
}
