import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { Token } from "../entities/token";
import { WebSocket } from "ws";
import { IncomingMessage } from "http";
import { ActiveClients, Message, MessageEvent } from "../entities/message";
import { AuthenticationService } from "./authentication_service";

@injectable()
export class MessagingService {
    private readonly clients: ActiveClients = new Map();

    constructor(
        @inject("Service")
        @named("AuthenticationService")
        private readonly authenticationService: AuthenticationService,
    ) {}

    async connection(ws: WebSocket, req: IncomingMessage): Promise<void> {
        try {
            const token = this.parseConnectionJWT(req);
            const user = await this.authenticationService.whoami(token);

            // add new client websocket connection to active clients map
            this.clients.set(user.account.userId, ws);

            // send new connection all their past messages
            console.log(user.account.userId, "joined");

            ws.on(MessageEvent.MESSAGE, (message: string) => this.message(ws, message));
            ws.on(MessageEvent.CLOSE, () => this.close(user.account.userId));
        } catch (error) {
            ws.close();
        }
    }

    /**
     * Routes the incoming message to the correct websocket client and saves the
     * message to the database
     * @param ws
     * @param rawMessage
     * @private
     */
    private message(ws: WebSocket, rawMessage: string): void {
        const message = JSON.parse(rawMessage) as Message;

        const client = this.clients.get(message.to);
        client.send(message.body);
    }

    /**
     * Remove userId and websocket client key value pair from active clients list when
     * close message event is sent
     * @param userId
     * @private
     */
    private close(userId: number): void {
        this.clients.delete(userId);
    }

    private parseConnectionJWT(req: IncomingMessage): Token {
        return req.url.split("=")[1];
    }
}
