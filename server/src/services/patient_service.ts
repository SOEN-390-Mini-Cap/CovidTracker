import "reflect-metadata";
import {inject, injectable, named} from "inversify";
import {StatusRepository} from "../repositories/status_repository";
import {StatusFields} from "../entities/status_fields";
import {PatientRepository} from "../repositories/patient_repository";
import {AuthorizationError} from "../entities/errors/authorization_error";
import { Status, StatusBody } from "../entities/status";
import {datesAreOnSameDay} from "../helpers/date_helper";
import {Role} from "../entities/role";
import {AuthenticationService} from "./authentication_service";

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

        const userStatusFields = await this.getPatientStatusFields(patientId);
        if (userStatusFields) {
            throw new Error("The status fields have already been set for this patient");
        }

        await this.statusRepository.updateStatusFields(patientId, fields);
    }

    async getPatientStatusFields(patientId: number): Promise<StatusFields> {
        return this.statusRepository.findStatusFields(patientId);
    }

    async submitStatus(patientId: number, status: StatusBody): Promise<void> {
        // limit the patient to a single status report per calendar day
        const patientStatus = await this.statusRepository.findLatestStatus(patientId);
        if (patientStatus && datesAreOnSameDay(patientStatus.createdOn, new Date())) {
            throw new Error("A patient can only submit one status report per calendar day");
        }

        // verify that status fields sent are the same status fields that were defined
        // by the patients doctor
        const userStatusFields = await this.statusRepository.findStatusFields(patientId);
        const isFormattedStatus =
            Object.keys(status).length === Object.keys(userStatusFields).length &&
            Object.keys(status).every((field) => status[field] !== null && field in userStatusFields);
        if (!isFormattedStatus) {
            throw new Error("Status is malformed");
        }

        await this.statusRepository.insertStatus(patientId, status);
    }

    async getStatus(statusId: number, reqUserId: number, role: Role): Promise<Status> {
        const status = await this.statusRepository.findStatus(statusId);

        // if patient -> jwt id and status id match
        // if doctor -> status id is patient of doctor
        // if health official
        const canUserAccess =
            (await this.authenticationService.isUserPatientOfDoctor(status.patientId, reqUserId)) ||
            reqUserId === status.patientId ||
            role === Role.HEALTH_OFFICIAL;
        if (!canUserAccess) {
            throw new AuthorizationError();
        }

        return status;
    }
}
