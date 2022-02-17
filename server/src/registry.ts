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
import {
    extractJwtMiddleware,
    isSamePatientMiddleware,
    isValidRoleMiddleware
} from "./controllers/auth_middleware";
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
import {Role} from "./entities/role";

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

// Services
container
    .bind<AuthenticationService>("Service")
    .to(AuthenticationService)
    .inSingletonScope()
    .whenTargetNamed("AuthenticationService");
container.bind<UserService>("Service").to(UserService).inSingletonScope().whenTargetNamed("UserService");
container.bind<PatientService>("Service").to(PatientService).inSingletonScope().whenTargetNamed("PatientService");
container.bind<DoctorService>("Service").to(DoctorService).inSingletonScope().whenTargetNamed("DoctorService");

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

// Database
container.bind<Pool>("DBConnectionPool").toConstantValue(new Pool());

// Middleware
container.bind<RequestHandler>("extractJwtMiddleware").toConstantValue(extractJwtMiddleware);
container.bind<RequestHandler>("isValidAdminMiddleware").toConstantValue(isValidRoleMiddleware([Role.ADMIN])(container));
container.bind<RequestHandler>("isValidDoctorMiddleware").toConstantValue(isValidRoleMiddleware([Role.DOCTOR])(container));
container.bind<RequestHandler>("isValidPatientMiddleware").toConstantValue(isValidRoleMiddleware([Role.PATIENT])(container));
container.bind<RequestHandler>("isSamePatientMiddleware").toConstantValue(isSamePatientMiddleware);

export { container };
