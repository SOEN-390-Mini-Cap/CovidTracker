import "dotenv/config";
import "reflect-metadata";
import { Container } from "inversify";
import { interfaces, InversifyRestifyServer, TYPE } from "inversify-restify-utils";
import { BaseController } from "./controllers/BaseController";
import { SignUpController } from "./controllers/SignUpController";

const container = new Container();
container.bind<interfaces.Controller>(TYPE.Controller).to(BaseController).whenTargetNamed("BaseController");
container.bind<interfaces.Controller>(TYPE.Controller).to(SignUpController).whenTargetNamed("SignUpController");

const server = new InversifyRestifyServer(container);

const app = server.build();

<<<<<<< HEAD
app.listen(process.env.PORT, () => {
    console.log(`Server has started on port ${process.env.PORT}`);
=======
app.listen(8080, () => {
    console.log("Server has started on port 8080");
>>>>>>> 7ec314b... added new signup controller with a post request
});

export { app };
