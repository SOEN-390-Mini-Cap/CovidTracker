import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { StatusRepository } from "../repositories/status_repository";
import { StatusFields } from "../entities/status_fields";
import { AuthorizationError } from "../entities/errors/authorization_error";
import { Status, StatusBody } from "../entities/status";
import { Role } from "../entities/role";
import { AuthenticationService } from "./authentication_service";
import { ReqUser } from "../entities/req_user";
import { NotificationService } from "./notification_service";
import { PatientRepository } from "../repositories/patient_repository";
import { UserRepository } from "../repositories/user_repository";

@injectable()
export class StatusService {
    constructor(
        @inject("Repository")
        @named("StatusRepository")
        private readonly statusRepository: StatusRepository,
        @inject("Service")
        @named("AuthenticationService")
        private readonly authenticationService: AuthenticationService,
        @inject("Service")
        @named("NotificationService")
        private readonly notificationService: NotificationService,
        @inject("Repository")
        @named("PatientRepository")
        private readonly patientRepository: PatientRepository,
        @inject("Repository")
        @named("UserRepository")
        private readonly userRepository: UserRepository,
    ) {}

    getStatusesStrategy(reqUser: ReqUser): () => Promise<Status[]> {
        if (reqUser.role === Role.DOCTOR) {
            return this.statusRepository.findStatusesByDoctor.bind(this.statusRepository, reqUser.userId);
        }

        throw new AuthorizationError();
    }

    async postStatus(reqUserId: number, patientId: number, statusBody: StatusBody): Promise<void> {
        const status = {
            statusId: null,
            patientId,
            isReviewed: false,
            createdOn: new Date(),
            statusBody,
        };

        if (reqUserId !== patientId) {
            throw new AuthorizationError();
        }

        // verify that status fields sent are the same status fields that were defined
        // by the patients doctor
        const userStatusFields = await this.statusRepository.findStatusFields(patientId);
        const isFormattedStatus =
            Object.keys(statusBody).length === Object.keys(userStatusFields).length &&
            Object.keys(statusBody).every((field) => statusBody[field] !== null && field in userStatusFields);
        if (!isFormattedStatus) {
            throw new Error("Status is malformed");
        }

        // send the patients doctor a notification if they update their status
        // i.e. they create more than one status in a single calendar day
        const latestStatus = await this.statusRepository.findLatestStatus(patientId);
        const isStatusUpdate =
            latestStatus?.createdOn.getFullYear() === status.createdOn.getFullYear() &&
            latestStatus?.createdOn.getMonth() === status.createdOn.getMonth() &&
            latestStatus?.createdOn.getDate() === status.createdOn.getDate();

        await this.statusRepository.insertStatus(status);

        if (isStatusUpdate) {
            const [assignedDoctorId, patient] = await Promise.all([
                this.patientRepository.findAssignedDoctorId(patientId),
                this.userRepository.findUserByUserId(reqUserId),
            ]);

            // eslint-disable-next-line
            const notificationBody = `Your patient ${patient.firstName} ${patient.lastName} has updated their latest status report at ${status.createdOn.toISOString()}. You can view this update in your CovidTracker status report inbox.`;
            this.notificationService.sendSMS(assignedDoctorId, notificationBody);
            this.notificationService.sendEmail(assignedDoctorId, "Patient status report update", notificationBody);
        }
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

    async putStatusReviewed(reqUser: ReqUser, statusId: number, isReviewed: boolean): Promise<void> {
        const status = await this.statusRepository.findStatus(statusId);
        const canUserAccess = await this.authenticationService.isUserPatientOfDoctor(status.patientId, reqUser.userId);
        if (!canUserAccess) {
            throw new AuthorizationError();
        }

        await this.statusRepository.updateStatusReviewed(statusId, isReviewed);
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
