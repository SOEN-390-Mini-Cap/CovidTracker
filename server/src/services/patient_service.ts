import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { StatusRepository } from "../repositories/status_repository";
import { StatusFields } from "../entities/status_fields";
import { PatientRepository } from "../repositories/patient_repository";
import { AuthorizationError } from "../entities/errors/authorization_error";
import { Status } from "../entities/status";

@injectable()
export class PatientService {
    constructor(
        @inject("Repository")
        @named("PatientRepository")
        private readonly patientRepository: PatientRepository,
        @inject("Repository")
        @named("StatusRepository")
        private readonly statusRepository: StatusRepository,
    ) {}

    async assignDoctor(patientId: number, doctorId: number): Promise<void> {
        await this.patientRepository.updateAssignedDoctor(patientId, doctorId);
    }

    async setStatusFields(doctorId: number, patientId: number, fields: StatusFields): Promise<void> {
        // verify 3 required fields are present and true
        const includesRequiredFields = !!(fields.temperature && fields.weight && fields.otherSymptoms);
        if (!includesRequiredFields) {
            throw new Error("The required status fields have not been set properly");
        }

        const assignedDoctorId = await this.patientRepository.findAssignedDoctorId(patientId);
        if (assignedDoctorId !== doctorId) {
            throw new AuthorizationError();
        }

        const userStatusFields = await this.getPatientStatusFields(patientId);
        if (userStatusFields) {
            throw new Error("The status fields have already been set for this patient");
        }

        await this.statusRepository.updatePatientStatusFields(patientId, fields);
    }

    async getPatientStatusFields(patientId: number): Promise<StatusFields> {
        return await this.statusRepository.findStatusFields(patientId);
    }

    async submitStatus(patientId: number, status: Status): Promise<void> {
        return;
    }
}
