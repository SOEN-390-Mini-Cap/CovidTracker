import "dotenv/config";
import "reflect-metadata";
import { InversifyRestifyServer } from "inversify-restify-utils";
import { plugins } from "restify";
import { container } from "./registry";
import * as corsMiddleware from "restify-cors-middleware2";

const server = new InversifyRestifyServer(container);

const cors = corsMiddleware({
    origins: ["http://localhost:3000"],
    allowHeaders: ["API-Token"],
    exposeHeaders: ["API-Token-Expiry"],
});

const app = server.build();
app.pre(cors.preflight);
app.use(plugins.bodyParser());
app.use(cors.actual);

app.listen(process.env.PORT, () => {
    console.log(`Server has started on port ${process.env.PORT}`);
});

export { app };
