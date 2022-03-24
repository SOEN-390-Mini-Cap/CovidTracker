import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { Token } from "../entities/token";
import { WebSocket } from "ws";
import { IncomingMessage } from "http";
import { ActiveClients, Message, MessageEvent, UserMessages } from "../entities/message";
import { AuthenticationService } from "./authentication_service";
import { MessageRepository } from "../repositories/message_repository";
import { ReqUser } from "../entities/req_user";
import {UserChat, ChatContacts, ChatContact} from "../entities/chat";
import { UserRepository } from "../repositories/user_repository";

@injectable()
export class MessageService {
    private readonly clients: ActiveClients = new Map();

    constructor(
        @inject("Service")
        @named("AuthenticationService")
        private readonly authenticationService: AuthenticationService,
        @inject("Repository")
        @named("MessageRepository")
        private readonly messageRepository: MessageRepository,
        @inject("Repository")
        @named("UserRepository")
        private readonly userRepository: UserRepository,
    ) {}

    async getMessages(reqUser: ReqUser, userId: number): Promise<UserChat> {
        return JSON.parse(
            '{"chat":{"id":1,"userId":1,"unseenMsgs":0,"chat":[{"message":"Hi","time":"Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)","senderId":11},{"message":"Hello. How can I help You?","time":"Mon Dec 11 2018 07:45:15 GMT+0000 (GMT)","senderId":2},{"message":"Can I get details of my last transaction I made last month?","time":"Mon Dec 11 2018 07:46:10 GMT+0000 (GMT)","senderId":11},{"message":"We need to check if we can provide you such information.","time":"Mon Dec 11 2018 07:45:15 GMT+0000 (GMT)","senderId":2},{"message":"I will inform you as I get update on this.","time":"Mon Dec 11 2018 07:46:15 GMT+0000 (GMT)","senderId":2},{"message":"If it takes long you can mail me at my mail address.","time":"2022-03-22T00:12:52.007Z","senderId":11}]},"contact":{"id":1,"fullName":"Felecia Rower","role":"Frontend Developer","about":"Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing","avatar":"/static/media/avatar-s-2.d21f2121.jpg","status":"offline","chat":{"id":1,"unseenMsgs":0,"lastMessage":{"message":"If it takes long you can mail me at my mail address.","time":"2022-03-22T00:12:52.007Z","senderId":11}}}}',
        );
    }

    async getChatsAdapter(reqUser: ReqUser): Promise<ChatContacts> {
        console.log("shouod be 6", reqUser.userId);
        const messages = await this.buildUserMessages(reqUser.userId);
        console.log(messages);

        const chatContacts: ChatContact[] = [];
        for (const userId in messages) {
            const chatId = +`${reqUser.userId}${userId}`;
            const { firstName, lastName } = await this.userRepository.findUserByUserId(+userId);

            chatContacts.push({
                id: chatId,
                fullName: firstName + lastName,
                chat: {
                    id: chatId,
                    unseenMsg: 0,
                    lastMessage: {
                        senderId: messages[userId][0].from,
                        message: messages[userId][0].body,
                        time: messages[userId][0].createdOn,
                    },
                },
            });
        }

        return {
            chats: chatContacts,
        };
        // return JSON.parse(
        //     '{"chats":[{"id":1,"fullName":"Felecia Rower","role":"Frontend Developer","about":"Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing","avatar":"/static/media/avatar-s-2.d21f2121.jpg","status":"offline","chat":{"id":1,"unseenMsgs":3,"lastMessage":{"message":"If it takes long you can mail me at my mail address.","time":"2022-03-22T00:12:52.007Z","senderId":11}}},{"id":2,"fullName":"Adalberto Granzin","role":"UI/UX Designer","about":"Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.","avatar":"/static/media/avatar-s-1.d383013d.jpg","status":"busy","chat":{"id":2,"unseenMsgs":1,"lastMessage":{"message":"I will purchase it for sure. 👍","time":"2022-03-23T00:12:52.007Z","senderId":1}}}]}',
        // );
    }

    async connection(ws: WebSocket, req: IncomingMessage): Promise<void> {
        try {
            const token = this.parseConnectionJWT(req);
            const user = await this.authenticationService.whoami(token);
            const userId = user.account.userId;

            // add new client websocket connection to active clients map
            this.clients.set(userId, ws);

            // send new connection all their past messages
            const messages = await this.buildUserMessages(userId);
            ws.send(JSON.stringify(messages));

            ws.on(MessageEvent.MESSAGE, (message: string) => this.message(ws, message, userId));
            ws.on(MessageEvent.CLOSE, () => this.close(userId));
        } catch (error) {
            ws.close();
        }
    }

    /**
     * Routes the incoming message to the correct websocket client and saves the
     * message to the database
     * @param ws
     * @param rawMessage
     * @param userId
     * @private
     */
    private async message(ws: WebSocket, rawMessage: string, userId: number): Promise<void> {
        const message = this.buildMessage(rawMessage, userId);
        this.messageRepository.insertMessage(message);

        const client = this.clients.get(message.to);
        if (client) {
            client.send(message.body);
        }
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

    private buildMessage(rawMessage: string, userId: number): Message {
        const { to, body } = JSON.parse(rawMessage);

        return {
            from: userId,
            to,
            body,
            createdOn: new Date(),
        };
    }

    private async buildUserMessages(userId: number): Promise<UserMessages> {
        const messages = await this.messageRepository.findMessages(userId);
        console.log(messages);

        // group the messages by the id of the user who isn't the client id
        return messages.reduce((messages, message) => {
            const isMessageFromMe = message.from === userId;
            const groupUserId = isMessageFromMe ? message.to : message.from;
            return {
                ...messages,
                [groupUserId]: [...(messages[groupUserId] || []), message],
            };
        }, {});
    }

    private parseConnectionJWT(req: IncomingMessage): Token {
        return req.url.split("=")[1];
    }
}
