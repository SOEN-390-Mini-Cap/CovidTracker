import "reflect-metadata";
import { Container } from "inversify";
import { interfaces, InversifyRestifyServer, TYPE } from "inversify-restify-utils";
import { BaseController } from "./controllers/BaseController";

const container = new Container();
container.bind<interfaces.Controller>(TYPE.Controller).to(BaseController).whenTargetNamed("BaseController");

const server = new InversifyRestifyServer(container);

const app = server.build();

app.listen(3000, () =>
    console.log("Server has started on port 3000");
});
