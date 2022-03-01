import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { StatusRepository } from "../repositories/status_repository";
import { StatusFields } from "../entities/status_fields";
import { AuthorizationError } from "../entities/errors/authorization_error";
import { Status, StatusBody } from "../entities/status";
import { datesAreOnSameDay } from "../helpers/date_helper";
import { Role } from "../entities/role";
import { AuthenticationService } from "./authentication_service";
import { ReqUser } from "../entities/req_user";

@injectable()
export class StatusService {
    constructor(
        @inject("Repository")
        @named("StatusRepository")
        private readonly statusRepository: StatusRepository,
        @inject("Service")
        @named("AuthenticationService")
        private readonly authenticationService: AuthenticationService,
    ) {}

    async getStatuses(reqUser: ReqUser): Promise<Status[]> {
        return this.getStatusesStrategy(reqUser)();
    }

    private getStatusesStrategy(reqUser: ReqUser): () => Promise<Status[]> {
        if (reqUser.role === Role.DOCTOR) {
            return this.statusRepository.findStatusesByDoctor.bind(this.statusRepository, reqUser.userId);
        }

        throw new AuthorizationError();
    }

    async postStatus(reqUserId: number, patientId: number, status: StatusBody): Promise<void> {
        if (!(reqUserId === patientId)) {
            throw new AuthorizationError();
        }

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

        await this.statusRepository.insertStatus({
            statusId: null,
            patientId,
            createdOn: new Date(),
            status,
        });
    }

    async getStatus(statusId: number, reqUserId: number, role: Role): Promise<Status> {
        const status = await this.statusRepository.findStatus(statusId);

        // if patient -> jwt id and status id match
        // if doctor -> status id is patient of doctor
        // if health official
        const canUserAccess =
            (await this.authenticationService.isUserPatientOfDoctor(status?.patientId, reqUserId)) ||
            reqUserId === status?.patientId ||
            role === Role.HEALTH_OFFICIAL;
        if (!canUserAccess) {
            throw new AuthorizationError();
        }

        return status;
    }

    async getStatusesForPatient(reqUserId: number, role: Role, patientId: number): Promise<Status[]> {
        const statuses = await this.statusRepository.findStatusesForPatient(patientId);

        // if patient -> jwt id and status id match
        // if doctor -> status id is patient of doctor
        // if health official
        const canUserAccess =
            (await this.authenticationService.isUserPatientOfDoctor(patientId, reqUserId)) ||
            reqUserId === patientId ||
            role === Role.HEALTH_OFFICIAL;
        if (!canUserAccess) {
            throw new AuthorizationError();
        }

        return statuses;
    }

    async postStatusFields(doctorId: number, patientId: number, fields: StatusFields): Promise<void> {
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

    async getStatusFields(reqUserId: number, patientId: number): Promise<StatusFields> {
        if (!(reqUserId === patientId)) {
            throw new AuthorizationError();
        }

        return this.statusRepository.findStatusFields(patientId);
    }
}
