import "dotenv/config";
import "reflect-metadata";
import { InversifyRestifyServer } from "inversify-restify-utils";
import { plugins } from "restify";
import { container } from "./registry";
import * as corsMiddleware from "restify-cors-middleware2";
import * as WebSocket from "ws";
import { MessagingService } from "./services/messaging_service";
import { MessageEvent } from "./entities/message_event";

const server = new InversifyRestifyServer(container);

const cors = corsMiddleware({
    origins: ["*", "http://covid-tracker-client-bucket.s3-website.us-east-2.amazonaws.com/"],
    allowHeaders: ["Authorization"],
    allowCredentialsAllOrigins: true,
});

const app = server.build();
app.pre(cors.preflight);
app.use(plugins.bodyParser());
app.use(cors.actual);

const wss = new WebSocket.Server({ server: app });
const messagingService = container.getNamed<MessagingService>("Service", "MessagingService");
wss.on(MessageEvent.CONNECTION, (ws, req) => messagingService.connection(ws, req));

app.listen(process.env.SERVER_PORT, () => console.log(`listening on PORT ${app.address().port}`));

export { app };
