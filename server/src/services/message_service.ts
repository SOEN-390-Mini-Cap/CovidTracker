import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { Token } from "../entities/token";
import { WebSocket } from "ws";
import { IncomingMessage } from "http";
import { ActiveClients, Message, MessageEvent, UserMessages } from "../entities/message";
import { AuthenticationService } from "./authentication_service";
import { MessageRepository } from "../repositories/message_repository";
import { ReqUser } from "../entities/req_user";
import { UserChat, ChatContacts, ChatContact, Chat } from "../entities/chat";
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

    async postMessage(message: Message): Promise<void> {
        message.createdOn = new Date();
        await this.messageRepository.insertMessage(message);
    }

    async getMessagesAdapter(reqUser: ReqUser, userId: number): Promise<UserChat> {
        const messages = await this.buildUserMessages(reqUser.userId);
        const lastMessageIndex = messages[userId].length - 1;

        const chatId = userId;
        const { firstName, lastName } = await this.userRepository.findUserByUserId(+userId);
        const contact = {
            id: chatId,
            fullName: `${firstName} ${lastName}`,
            chat: {
                id: chatId,
                unseenMsg: 0,
                lastMessage: {
                    senderId: messages[userId][lastMessageIndex].from,
                    message: messages[userId][lastMessageIndex].body,
                    time: messages[userId][lastMessageIndex].createdOn,
                    isPriority: messages[userId][lastMessageIndex].isPriority,
                },
            },
        } as ChatContact;

        const cleanedMessages = messages[userId].length === 1 ? [] : messages[userId].slice(1);
        const chat: Chat = {
            id: chatId,
            userId,
            unseenMsg: 0,
            chat: cleanedMessages.map((message) => ({
                senderId: message.from,
                message: message.body,
                time: message.createdOn,
                isPriority: message.isPriority,
            })),
        };

        return {
            chat,
            contact,
        };
    }

    async getChatsAdapter(reqUser: ReqUser): Promise<ChatContacts> {
        const messages = await this.buildUserMessages(reqUser.userId);
        const chatContacts = await Promise.all(
            Object.keys(messages).map(async (userId) => {
                const chatId = +userId;
                const { firstName, lastName } = await this.userRepository.findUserByUserId(+userId);
                const lastMessageIndex = messages[userId].length - 1;

                return {
                    id: chatId,
                    fullName: `${firstName} ${lastName}`,
                    chat: {
                        id: chatId,
                        unseenMsg: 0,
                        lastMessage: {
                            senderId: messages[userId][lastMessageIndex].from,
                            message: messages[userId][lastMessageIndex].body,
                            time: messages[userId][lastMessageIndex].createdOn,
                            isPriority: messages[userId][lastMessageIndex].isPriority,
                        },
                    },
                } as ChatContact;
            }),
        );

        return {
            chats: chatContacts,
        };
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
            isPriority: false,
        };
    }

    private async buildUserMessages(userId: number): Promise<UserMessages> {
        const messages = await this.messageRepository.findMessages(userId);

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
