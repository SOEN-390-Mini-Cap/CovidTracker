import { inject, injectable, named } from "inversify";
import { AuthenticationService } from "./authentication_service";
import { AuthorizationError } from "../entities/errors/authorization_error";
import { UserRepository } from "../repositories/user_repository";
import { AppointmentRepository } from "../repositories/appointment_repository";
import { Appointment } from "../entities/appointment";
import { ReqUser } from "../entities/req_user";

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
    }
}
