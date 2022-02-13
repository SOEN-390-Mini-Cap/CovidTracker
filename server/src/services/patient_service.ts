import { inject, injectable, named } from "inversify";
import { PatientRepository } from "../repositories/patient_repository";

@injectable()
export class PatientService {
    constructor(
        @inject("Repository")
        @named("PatientRepository")
        private readonly patientRepository: PatientRepository,
    ) {}

    async assignDoctor(patientId: number, doctorId: number): Promise<void> {
        await this.patientRepository.assignDoctor(patientId, doctorId);
    }
}
