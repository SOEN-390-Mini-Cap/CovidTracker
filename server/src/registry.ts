import { Container } from "inversify";
import { interfaces, TYPE } from "inversify-restify-utils";
import { BaseController } from "./controllers/base_controller";
import { AuthenticationController } from "./controllers/authentication_controller";
import { AuthenticationService } from "./services/authentication_service";
import { UserRepository } from "./repositories/user_repository";
import { Pool } from "pg";

const container = new Container();

// Controllers
container.bind<interfaces.Controller>(TYPE.Controller).to(BaseController).whenTargetNamed("BaseController");
container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(AuthenticationController)
    .whenTargetNamed("AuthenticationController");

// Services
container
    .bind<AuthenticationService>("Service")
    .to(AuthenticationService)
    .inSingletonScope()
    .whenTargetNamed("AuthenticationService");

// Repositories
container.bind<UserRepository>("Repository").to(UserRepository).inSingletonScope().whenTargetNamed("UserRepository");

// Database
container.bind<Pool>("DBConnectionPool").toConstantValue(new Pool());

export { container };
