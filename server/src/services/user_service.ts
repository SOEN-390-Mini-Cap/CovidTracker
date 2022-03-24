import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { UserRepository } from "../repositories/user_repository";
import { User } from "../entities/user";
import { Role } from "../entities/role";
import { PatientRepository } from "../repositories/patient_repository";
import { DoctorRepository } from "../repositories/doctor_repository";
import { AdminRepository } from "../repositories/admin_repository";
import { HealthOfficialRepository } from "../repositories/health_official_repository";
import { ImmigrationOfficerRepository } from "../repositories/immigration_officer_repository";
import { AuthorizationError } from "../entities/errors/authorization_error";
import { AuthenticationService } from "./authentication_service";
import {MessageRepository} from "../repositories/message_repository";

@injectable()
export class UserService {
    constructor(
        @inject("Repository")
        @named("UserRepository")
        private readonly userRepository: UserRepository,
        @inject("Repository")
        @named("PatientRepository")
        private readonly patientRepository: PatientRepository,
        @inject("Repository")
        @named("DoctorRepository")
        private readonly doctorRepository: DoctorRepository,
        @inject("Repository")
        @named("AdminRepository")
        private readonly adminRepository: AdminRepository,
        @inject("Repository")
        @named("HealthOfficialRepository")
        private readonly healthOfficialRepository: HealthOfficialRepository,
        @inject("Repository")
        @named("ImmigrationOfficerRepository")
        private readonly immigrationOfficerRepository: ImmigrationOfficerRepository,
        @inject("Service")
        @named("AuthenticationService")
        private readonly authenticationService: AuthenticationService,
        @inject("Repository")
        @named("MessageRepository")
        private readonly messageRepository: MessageRepository,
    ) {}

    async findMe(userId: number): Promise<User> {
        const user = await this.userRepository.findUserByUserId(userId);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    async findUser(reqUserId: number, reqUserRole: Role, userId: number): Promise<User> {
        const canUserAccess =
            (await this.authenticationService.isUserPatientOfDoctor(userId, reqUserId)) ||
            reqUserId === userId ||
            reqUserRole === Role.HEALTH_OFFICIAL;
        if (!canUserAccess) {
            throw new AuthorizationError();
        }

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

    async assignRole(userId: number, role: Role): Promise<void> {
        switch (role) {
            case Role.PATIENT:
                await this.patientRepository.addPatient(userId);
                break;
            case Role.DOCTOR:
                await this.doctorRepository.addDoctor(userId);
                break;
            case Role.ADMIN:
                await this.adminRepository.addAdmin(userId);
                break;
            case Role.HEALTH_OFFICIAL:
                await this.healthOfficialRepository.addHealthOfficial(userId);
                break;
            case Role.IMMIGRATION_OFFICER:
                await this.immigrationOfficerRepository.addImmigrationOfficer(userId);
                break;
        }
    }
}
