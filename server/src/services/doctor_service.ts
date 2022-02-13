import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { PatientRepository } from "../repositories/patient_repository";
import { PatientCounts } from "../entities/patient_counts";

@injectable()
export class DoctorService {
    constructor(
        @inject("Repository")
        @named("PatientRepository")
        private readonly patientRepository: PatientRepository,
    ) {}

    async getPatientCounts(): Promise<PatientCounts> {
        return this.patientRepository.findPatientCounts();
    }
}
