import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { StatusRepository } from "../repositories/status_repository";
import { StatusFields } from "../entities/status_fields";
import { PatientRepository } from "../repositories/patient_repository";
import { AuthorizationError } from "../entities/errors/authorization_error";

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

        const userStatusFields = await this.statusRepository.findStatusFields(patientId);
        if (userStatusFields) {
            throw new Error("The status fields have already been set for this patient");
        }

        await this.statusRepository.updatePatientStatusFields(patientId, fields);
    }
}
