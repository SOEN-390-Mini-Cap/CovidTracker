import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { PatientRepository } from "../repositories/patient_repository";
import { ReqUser } from "../entities/req_user";
import { User } from "../entities/user";
import { Role } from "../entities/role";
import { AuthorizationError } from "../entities/errors/authorization_error";
import { AuthenticationService } from "./authentication_service";
import { MessageRepository } from "../repositories/message_repository";

@injectable()
export class PatientService {
    constructor(
        @inject("Repository")
        @named("PatientRepository")
        private readonly patientRepository: PatientRepository,
        @inject("Service")
        @named("AuthenticationService")
        private readonly authenticationService: AuthenticationService,
        @inject("Repository")
        @named("MessageRepository")
        private readonly messageRepository: MessageRepository,
    ) {}

    async assignDoctor(patientId: number, doctorId: number): Promise<void> {
        const assignedDoctorId = await this.patientRepository.findAssignedDoctorId(patientId);
        if (assignedDoctorId !== null) {
            throw new Error("Patient can not be assigned a new doctor");
        }

        await this.patientRepository.updateAssignedDoctor(patientId, doctorId);
        await this.messageRepository.insertMessage({
            from: doctorId,
            to: patientId,
            body: "",
            createdOn: new Date(),
        });
    }

    getPatientsStrategy(reqUser: ReqUser): () => Promise<User[]> {
        if (reqUser.role === Role.DOCTOR) {
            return this.patientRepository.findPatientsAssignedToDoctor.bind(this.patientRepository, reqUser.userId);
        }
        if (reqUser.role === Role.HEALTH_OFFICIAL) {
            return this.patientRepository.findPatients.bind(this.patientRepository);
        }

        throw new AuthorizationError();
    }

    async putPatientPrioritized(reqUser: ReqUser, patientId: number, isPrioritized: boolean): Promise<void> {
        const canUserAccess =
            (await this.authenticationService.isUserPatientOfDoctor(patientId, reqUser.userId)) ||
            reqUser.role === Role.HEALTH_OFFICIAL ||
            reqUser.role === Role.IMMIGRATION_OFFICER;
        if (!canUserAccess) {
            throw new AuthorizationError();
        }

        await this.patientRepository.updatePatientPrioritized(patientId, isPrioritized);
    }
}
