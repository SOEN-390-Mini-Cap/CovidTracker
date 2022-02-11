import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { StatusRepository } from "../repositories/status_repository";
import { StatusFields } from "../entities/status_fields";

@injectable()
export class PatientService {
    constructor(
        @inject("Repository")
        @named("StatusRepository")
        private readonly statusRepository: StatusRepository,
    ) {}

    async setStatusFields(patientId: number, fields: StatusFields): Promise<void> {
        // verify 3 required fields are present and true
        const includesRequiredFields = !!(fields.temperature && fields.weight && fields.otherSymptoms);
        if (!includesRequiredFields) {
            throw new Error("The required status fields have not been set properly");
        }

        const userStatusFields = await this.statusRepository.findStatusFieldsByPatientId(patientId);
        if (userStatusFields) {
            throw new Error("The status fields have already been set for this patient");
        }

        await this.statusRepository.updatePatientStatusFields(patientId, fields);
    }
}
