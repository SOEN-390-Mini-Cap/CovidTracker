import { inject, injectable, named } from "inversify";
import { AuthenticationService } from "./authentication_service";
import { AuthorizationError } from "../entities/errors/authorization_error";
import { UserRepository } from "../repositories/user_repository";
import { AppointmentRepository } from "../repositories/appointment_repository";
import { Appointment } from "../entities/appointment";
import { ReqUser } from "../entities/req_user";
import { NotificationService } from "./notification_service";

@injectable()
export class AppointmentService {
    constructor(
        @inject("Repository")
        @named("AppointmentRepository")
        private readonly appointmentRepository: AppointmentRepository,
        @inject("Repository")
        @named("UserRepository")
        private readonly userRepository: UserRepository,
        @inject("Service")
        @named("AuthenticationService")
        private readonly authenticationService: AuthenticationService,
        @inject("Service")
        @named("NotificationService")
        private readonly notificationService: NotificationService,
    ) {}

    async postAppointment(reqUser: ReqUser, appointment: Appointment): Promise<void> {
        const userAccess = await this.authenticationService.isUserPatientOfDoctor(
            appointment.patientId,
            reqUser.userId,
        );
        if (!userAccess) {
            throw new AuthorizationError();
        }

        appointment.address.addressId = await this.userRepository.addAddress(appointment.address);
        await this.appointmentRepository.insertAppointment(appointment);

        // notify patient of new appointment
        const doctor = await this.userRepository.findUserByUserId(appointment.doctorId);
        // eslint-disable-next-line
        const notificationBody = `Your doctor ${doctor.firstName} ${doctor.lastName} has booked an appointment from ${appointment.startDate.toISOString()} to ${appointment.endDate.toISOString()}. You can view more details about this appointment through the CovidTracker application.`;
        this.notificationService.sendSMS(appointment.patientId, notificationBody);
        this.notificationService.sendEmail(
            appointment.patientId,
            "Your doctor has booked a new appointment",
            notificationBody,
        );
    }

    async getAppointments(reqUser: ReqUser): Promise<Appointment[]> {
        return this.appointmentRepository.findAppointments(reqUser.userId);
    }
}
