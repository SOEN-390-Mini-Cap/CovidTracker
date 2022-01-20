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

container.bind(AuthenticationRepository).toSelf();

//regsiter services.

container.bind(AuthenticationService).toSelf();

const server = new InversifyRestifyServer(container);

const app = server.build();
app.use(plugins.bodyParser());

<<<<<<< HEAD
<<<<<<< HEAD
app.listen(process.env.PORT, () => {
    console.log(`Server has started on port ${process.env.PORT}`);
=======
app.listen(8080, () => {
    console.log("Server has started on port 8080");
>>>>>>> 7ec314b... added new signup controller with a post request
=======
app.listen(process.env.PORT, () => {
    console.log(`Server has started on port ${process.env.PORT}`);
>>>>>>> cb6d16a... fix merge conflict
});

export { app };
