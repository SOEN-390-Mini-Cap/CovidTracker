import "dotenv/config";
import "reflect-metadata";
import { Container } from "inversify";
import { interfaces, InversifyRestifyServer, TYPE } from "inversify-restify-utils";
import { BaseController } from "./controllers/base_controller";
import { AuthenticationController } from "./controllers/authentication_controller";
import { plugins } from "restify";
import { AuthenticationService } from "./services/authentication_service";
import { AuthenticationRepository } from "./repositories/authentication_repository";
import { Pool } from "pg";
import { AddressRepository } from "./repositories/address_repository";

const container = new Container();

container.bind<interfaces.Controller>(TYPE.Controller).to(BaseController).whenTargetNamed("BaseController");
container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(AuthenticationController)
    .whenTargetNamed("AuthenticationController");

container
    .bind<AuthenticationService>("Service")
    .to(AuthenticationService)
    .inSingletonScope()
    .whenTargetNamed("AuthenticationService");

container
    .bind<AuthenticationRepository>("Repository")
    .to(AuthenticationRepository)
    .inSingletonScope()
    .whenTargetNamed("AuthenticationRepository");

container
    .bind<AddressRepository>("Repository")
    .to(AddressRepository)
    .inSingletonScope()
    .whenTargetNamed("AddressRepository");

container.bind<Pool>("DBConnectionPool").toConstantValue(new Pool());

const server = new InversifyRestifyServer(container);

const app = server.build();
app.use(plugins.bodyParser());

app.listen(process.env.PORT, () => {
    console.log(`Server has started on port ${process.env.PORT}`);
});

export { app };
