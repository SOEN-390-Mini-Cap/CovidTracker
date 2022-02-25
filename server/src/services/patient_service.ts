import "reflect-metadata";
import {inject, injectable, named} from "inversify";
import {StatusRepository} from "../repositories/status_repository";
import {StatusFields} from "../entities/status_fields";
import {PatientRepository} from "../repositories/patient_repository";
import {AuthorizationError} from "../entities/errors/authorization_error";
import {datesAreOnSameDay} from "../helpers/date_helper";
import {Role} from "../entities/role";
import {AuthenticationService} from "./authentication_service";
import {AuthenticationError} from "../entities/errors/authentication_error";

@injectable()
export class PatientService {
    constructor(
        @inject("Repository")
        @named("PatientRepository")
        private readonly patientRepository: PatientRepository,
        @inject("Repository")
        @named("StatusRepository")
        private readonly statusRepository: StatusRepository,
        @inject("Service")
        @named("AuthenticationService")
        private readonly authenticationService: AuthenticationService,
    ) {}

    async assignDoctor(patientId: number, doctorId: number): Promise<void> {
        const assignedDoctorId = await this.patientRepository.findAssignedDoctorId(patientId);
        if (assignedDoctorId !== null) {
            throw new Error("Patient can not be assigned a new doctor");
        }

        await this.patientRepository.updateAssignedDoctor(patientId, doctorId);
    }

    async setStatusFields(doctorId: number, patientId: number, fields: StatusFields): Promise<void> {
        // verify 3 required fields are present and true
        const includesRequiredFields = !!(fields.temperature && fields.weight && fields.otherSymptoms);
        if (!includesRequiredFields) {
            throw new Error("The required status fields have not been set properly");
        }

        if (!(await this.authenticationService.isUserPatientOfDoctor(patientId, doctorId))) {
            throw new AuthorizationError();
        }

        if (await this.statusRepository.findStatusFields(patientId)) {
            throw new Error("The status fields have already been set for this patient");
        }

        await this.statusRepository.updateStatusFields(patientId, fields);
    }

    async getPatientStatusFields(reqUserId: number, patientId: number): Promise<StatusFields> {
        if (!(reqUserId === patientId)) {
            throw new AuthorizationError();
        }

        return this.statusRepository.findStatusFields(patientId);
    }
}
