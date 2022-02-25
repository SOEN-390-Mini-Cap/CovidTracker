import "reflect-metadata";
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
        const assignedDoctorId = await this.patientRepository.findAssignedDoctorId(patientId);
        if (assignedDoctorId !== null) {
            throw new Error("Patient can not be assigned a new doctor");
        }

        await this.patientRepository.updateAssignedDoctor(patientId, doctorId);
    }
}
