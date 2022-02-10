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
import { extractJwtMiddleware, isValidRoleMiddleware } from "./controllers/auth_middleware";
import { Role } from "./entities/role";

const container = new Container();

// Controllers
container.bind<interfaces.Controller>(TYPE.Controller).to(BaseController).whenTargetNamed("BaseController");
container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(AuthenticationController)
    .whenTargetNamed("AuthenticationController");
container.bind<interfaces.Controller>(TYPE.Controller).to(UserController).whenTargetNamed("UserController");

// Services
container
    .bind<AuthenticationService>("Service")
    .to(AuthenticationService)
    .inSingletonScope()
    .whenTargetNamed("AuthenticationService");
container.bind<UserService>("Service").to(UserService).inSingletonScope().whenTargetNamed("UserService");

// Repositories
container.bind<UserRepository>("Repository").to(UserRepository).inSingletonScope().whenTargetNamed("UserRepository");

// Database
container.bind<Pool>("DBConnectionPool").toConstantValue(new Pool());

// Middleware
container.bind<RequestHandler>("extractJwtMiddleware").toConstantValue(extractJwtMiddleware);
container.bind<RequestHandler>("isValidAdminMiddleware").toConstantValue(isValidRoleMiddleware([Role.ADMIN]));

export { container };
