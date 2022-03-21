import "dotenv/config";
import "reflect-metadata";
import { InversifyRestifyServer } from "inversify-restify-utils";
import { plugins } from "restify";
import { container } from "./registry";
import * as corsMiddleware from "restify-cors-middleware2";
import * as WebSocket from 'ws';
import {MessagingService} from "./services/messaging_service";
import {MessageEvent} from "./entities/message_event";

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
wss.on(MessageEvent.CONNECTION, (ws, req) => {
    // authenticate user
    console.log(req.url);
    // send new connection all their past messages
    ws.send("Hi there, I am a WebSocket server");

    // on message recieve handle new message sent
    ws.on(MessageEvent.MESSAGE, (message: string) => {
        //log the received message and send it back to the client
        console.log("received: %s", message);
        ws.send(`Hello, you sent -> ${message}`);
    });
});

app.listen(process.env.SERVER_PORT, () => console.log(`listening on PORT ${app.address().port}`));

export { app };
