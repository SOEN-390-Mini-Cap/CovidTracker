import { Container } from "inversify";
import { interfaces, TYPE } from "inversify-restify-utils";
import { BaseController } from "./controllers/base_controller";
import { AuthenticationController } from "./controllers/authentication_controller";
import { AuthenticationService } from "./services/authentication_service";
import { UserRepository } from "./repositories/user_repository";
import { Pool } from "pg";
import { UserController } from "./controllers/user_controller";
import { UserService } from "./services/user_service";
import { RequestHandler } from "restify";
import { injectAuthDataMiddleware, isValidRoleMiddleware } from "./middleware/auth_middleware";
import { PatientRepository } from "./repositories/patient_repository";
import { DoctorRepository } from "./repositories/doctor_repository";
import { AdminRepository } from "./repositories/admin_repository";
import { HealthOfficialRepository } from "./repositories/health_official_repository";
import { ImmigrationOfficerRepository } from "./repositories/immigration_officer_repository";
import { PatientController } from "./controllers/patient_controller";
import { PatientService } from "./services/patient_service";
import { StatusRepository } from "./repositories/status_repository";
import { DoctorController } from "./controllers/doctor_controller";
import { DoctorService } from "./services/doctor_service";
import { Role } from "./entities/role";
import { StatusController } from "./controllers/status_controller";
import { StatusService } from "./services/status_service";
import { TestController } from "./controllers/test_controller";
import { TestService } from "./services/test_service";
import { TestRepository } from "./repositories/test_repository";
import * as twilio from "twilio";
import { NotificationGateway } from "./gateways/notification_gateway";
import { NotificationController } from "./controllers/notification_controller";
import { NotificationService } from "./services/notification_service";
import * as nodemailer from "nodemailer";
import { Transporter } from "nodemailer";
import * as SMTPTransport from "nodemailer/lib/smtp-transport";
import { MessageService } from "./services/message_service";
import { MessageRepository } from "./repositories/message_repository";
import { AppointmentController } from "./controllers/appointment_controller";
import { AppointmentService } from "./services/appointment_service";
import { AppointmentRepository } from "./repositories/appointment_repository";
import { LocationReportController } from "./controllers/location_report_controller";
import { LocationReportService } from "./services/location_report_service";
import { LocationReportRepository } from "./repositories/location_report_repository";
import { MessageController } from "./controllers/message_controller";
import { DashboardController } from "./controllers/dashboard_controller";
import { DashboardStrategy } from "./services/dashboard/dashboard_strategy";
import { DashboardBuilder } from "./services/dashboard/dashboard_builder";
import { DashboardRepository } from "./repositories/dashboard_repository";

const container = new Container();

// Controllers
container.bind<interfaces.Controller>(TYPE.Controller).to(BaseController).whenTargetNamed("BaseController");
container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(AuthenticationController)
    .whenTargetNamed("AuthenticationController");
container.bind<interfaces.Controller>(TYPE.Controller).to(UserController).whenTargetNamed("UserController");
container.bind<interfaces.Controller>(TYPE.Controller).to(PatientController).whenTargetNamed("PatientController");
container.bind<interfaces.Controller>(TYPE.Controller).to(DoctorController).whenTargetNamed("DoctorController");
container.bind<interfaces.Controller>(TYPE.Controller).to(StatusController).whenTargetNamed("StatusController");
container.bind<interfaces.Controller>(TYPE.Controller).to(TestController).whenTargetNamed("TestController");
container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(NotificationController)
    .whenTargetNamed("NotificationController");
container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(AppointmentController)
    .whenTargetNamed("AppointmentController");
container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(LocationReportController)
    .whenTargetNamed("LocationReportController");
container.bind<interfaces.Controller>(TYPE.Controller).to(MessageController).whenTargetNamed("MessageController");
container.bind<interfaces.Controller>(TYPE.Controller).to(DashboardController).whenTargetNamed("DashboardController");

// Services
container
    .bind<AuthenticationService>("Service")
    .to(AuthenticationService)
    .inSingletonScope()
    .whenTargetNamed("AuthenticationService");
container.bind<UserService>("Service").to(UserService).inSingletonScope().whenTargetNamed("UserService");
container.bind<PatientService>("Service").to(PatientService).inSingletonScope().whenTargetNamed("PatientService");
container.bind<DoctorService>("Service").to(DoctorService).inSingletonScope().whenTargetNamed("DoctorService");
container.bind<StatusService>("Service").to(StatusService).inSingletonScope().whenTargetNamed("StatusService");
container.bind<TestService>("Service").to(TestService).inSingletonScope().whenTargetNamed("TestService");
container
    .bind<NotificationService>("Service")
    .to(NotificationService)
    .inSingletonScope()
    .whenTargetNamed("NotificationService");
container.bind<MessageService>("Service").to(MessageService).inSingletonScope().whenTargetNamed("MessageService");
container
    .bind<AppointmentService>("Service")
    .to(AppointmentService)
    .inSingletonScope()
    .whenTargetNamed("AppointmentService");
container
    .bind<LocationReportService>("Service")
    .to(LocationReportService)
    .inSingletonScope()
    .whenTargetNamed("LocationReportService");
container
    .bind<DashboardStrategy>("Service")
    .to(DashboardStrategy)
    .inSingletonScope()
    .whenTargetNamed("DashboardStrategy");
container.bind<DashboardBuilder>("Service").to(DashboardBuilder).inSingletonScope().whenTargetNamed("DashboardBuilder");

// Twilio
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
container.bind<twilio.Twilio>("TwilioClient").toConstantValue(twilioClient);

// Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: +process.env.NODEMAILER_PORT,
    auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASSWORD,
    },
});
container.bind<Transporter<SMTPTransport.SentMessageInfo>>("NodemailerTransporter").toConstantValue(transporter);

// Repositories
container.bind<UserRepository>("Repository").to(UserRepository).inSingletonScope().whenTargetNamed("UserRepository");
container
    .bind<PatientRepository>("Repository")
    .to(PatientRepository)
    .inSingletonScope()
    .whenTargetNamed("PatientRepository");
container
    .bind<DoctorRepository>("Repository")
    .to(DoctorRepository)
    .inSingletonScope()
    .whenTargetNamed("DoctorRepository");
container.bind<AdminRepository>("Repository").to(AdminRepository).inSingletonScope().whenTargetNamed("AdminRepository");
container
    .bind<HealthOfficialRepository>("Repository")
    .to(HealthOfficialRepository)
    .inSingletonScope()
    .whenTargetNamed("HealthOfficialRepository");
container
    .bind<ImmigrationOfficerRepository>("Repository")
    .to(ImmigrationOfficerRepository)
    .inSingletonScope()
    .whenTargetNamed("ImmigrationOfficerRepository");
container
    .bind<StatusRepository>("Repository")
    .to(StatusRepository)
    .inSingletonScope()
    .whenTargetNamed("StatusRepository");
container.bind<TestRepository>("Repository").to(TestRepository).inSingletonScope().whenTargetNamed("TestRepository");
container
    .bind<MessageRepository>("Repository")
    .to(MessageRepository)
    .inSingletonScope()
    .whenTargetNamed("MessageRepository");
container
    .bind<AppointmentRepository>("Repository")
    .to(AppointmentRepository)
    .inSingletonScope()
    .whenTargetNamed("AppointmentRepository");
container
    .bind<LocationReportRepository>("Repository")
    .to(LocationReportRepository)
    .inSingletonScope()
    .whenTargetNamed("LocationReportRepository");
container
    .bind<DashboardRepository>("Repository")
    .to(DashboardRepository)
    .inSingletonScope()
    .whenTargetNamed("DashboardRepository");

// Database
container.bind<Pool>("DBConnectionPool").toConstantValue(new Pool());

// Gateway
container.bind<NotificationGateway>("Gateway").to(NotificationGateway).inSingletonScope().whenTargetNamed("SMSGateway");

// Middleware
container.bind<RequestHandler>("injectAuthDataMiddleware").toConstantValue(injectAuthDataMiddleware(container));
container.bind<RequestHandler>("isValidAdminMiddleware").toConstantValue(isValidRoleMiddleware([Role.ADMIN]));
container.bind<RequestHandler>("isValidDoctorMiddleware").toConstantValue(isValidRoleMiddleware([Role.DOCTOR]));
container.bind<RequestHandler>("isValidPatientMiddleware").toConstantValue(isValidRoleMiddleware([Role.PATIENT]));
container
    .bind<RequestHandler>("isValidPatientOrUserMiddleware")
    .toConstantValue(isValidRoleMiddleware([Role.PATIENT, Role.USER]));
container
    .bind<RequestHandler>("isValidPatientOrDoctorMiddleware")
    .toConstantValue(isValidRoleMiddleware([Role.PATIENT, Role.DOCTOR]));

export { container };
