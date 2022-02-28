import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { PatientRepository } from "../repositories/patient_repository";
import { ReqUser } from "../entities/req_user";
import { User } from "../entities/user";
import { Role } from "../entities/role";
import { AuthorizationError } from "../entities/errors/authorization_error";

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

    async getPatients(reqUser: ReqUser): Promise<User[]> {
        return this.getPatientsStrategy(reqUser)();
    }

    private getPatientsStrategy(reqUser: ReqUser): () => Promise<User[]> {
        if (reqUser.role === Role.DOCTOR) {
            return this.patientRepository.findPatientsAssignedToDoctor.bind(this.patientRepository, reqUser.userId);
        }
        if (reqUser.role === Role.HEALTH_OFFICIAL) {
            return this.patientRepository.findPatients.bind(this.patientRepository);
        }

        throw new AuthorizationError();
    }
}
