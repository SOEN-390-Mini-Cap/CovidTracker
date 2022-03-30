import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { PatientRepository } from "../repositories/patient_repository";
import { ReqUser } from "../entities/req_user";
import { User } from "../entities/user";
import { Role } from "../entities/role";
import { AuthorizationError } from "../entities/errors/authorization_error";
import { AuthenticationService } from "./authentication_service";
import { MessageRepository } from "../repositories/message_repository";
import { PatientFilters } from "../entities/patient_filters";

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
            isPriority: false,
        });
    }

    getPatientsStrategy(reqUser: ReqUser, filters: PatientFilters): () => Promise<User[]> {
        const isFiltered: boolean = !!filters.testDateTo && !!filters.testDateFrom && !!filters.status;

        if (reqUser.role === Role.DOCTOR) {
            if (isFiltered) {
                return this.patientRepository.findPatientsAssignedToDoctorFiltered.bind(
                    this.patientRepository,
                    reqUser.userId,
                    filters.status,
                    filters.testDateFrom,
                    filters.testDateTo,
                );
            } else {
                return this.patientRepository.findPatientsAssignedToDoctor.bind(this.patientRepository, reqUser.userId);
            }
        }
        if (reqUser.role === Role.HEALTH_OFFICIAL) {
            if (isFiltered) {
                return this.patientRepository.findPatientsFiltered.bind(
                    this.patientRepository,
                    filters.status,
                    filters.testDateFrom,
                    filters.testDateTo,
                );
            } else {
                return this.patientRepository.findPatients.bind(this.patientRepository);
            }
        }
        if (reqUser.role === Role.IMMIGRATION_OFFICER) {
            if (isFiltered) {
                return this.patientRepository.findPatientsFiltered.bind(
                    this.patientRepository,
                    filters.status,
                    filters.testDateFrom,
                    filters.testDateTo,
                );
            } else {
                return this.patientRepository.findPatients.bind(this.patientRepository);
            }
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
