import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { Token } from "../entities/token";
import { WebSocket } from "ws";
import { IncomingMessage } from "http";
import { MessageEvent } from "../entities/message_event";
import { AuthenticationService } from "./authentication_service";

@injectable()
export class MessagingService {
    constructor(
        @inject("Service")
        @named("AuthenticationService")
        private readonly authenticationService: AuthenticationService,
    ) {}

    async connection(ws: WebSocket, req: IncomingMessage): Promise<void> {
        // authenticate user
        try {
            const token = this.parseConnectionJWT(req);
            const user = await this.authenticationService.whoami(token);

            console.log(user);
            // send new connection all their past messages
            ws.send("Hi there, I am a WebSocket server");

            // on message recieve handle new message sent
            ws.on(MessageEvent.MESSAGE, (message: string) => this.message(ws, message));
        } catch (error) {
            // handle bad connection and close
        }
    }

    private message(ws: WebSocket, message: string): void {
        //log the received message and send it back to the client
        console.log("received: %s", message);
        ws.send(`Hello, you sent -> ${message}`);
    }

    private parseConnectionJWT(req: IncomingMessage): Token {
        return req.url.split("=")[1];
    }
}
