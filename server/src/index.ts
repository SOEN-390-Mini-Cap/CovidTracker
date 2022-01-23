import "dotenv/config";
import "reflect-metadata";
import { Container } from "inversify";
import { interfaces, InversifyRestifyServer, TYPE } from "inversify-restify-utils";
import { BaseController } from "./controllers/BaseController";
import { AuthenticationController } from "./controllers/AuthenticationController";
import { plugins } from "restify";
import { AuthenticationService } from "./services/AuthenticationService";
import { AuthenticationRepository } from "./repositories/AuthenticationRepository";

const container = new Container();
container.bind<interfaces.Controller>(TYPE.Controller).to(BaseController).whenTargetNamed("BaseController");
container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(AuthenticationController)
    .whenTargetNamed("AuthenticationController");

//register Repositories.

container
    .bind<AuthenticationRepository>("Repository")
    .to(AuthenticationRepository)
    .inSingletonScope()
    .whenTargetNamed("AuthenticationRepository");

//regsiter services.

container
    .bind<AuthenticationService>("Service")
    .to(AuthenticationService)
    .inSingletonScope()
    .whenTargetNamed("AuthenticationService");

const server = new InversifyRestifyServer(container);

const app = server.build();
app.use(plugins.bodyParser());

app.listen(process.env.PORT, () => {
    console.log(`Server has started on port ${process.env.PORT}`);
});

export { app };
