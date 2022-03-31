import { WebSocket } from "ws";

export type Message = {
    messageId?: number;
    from: number;
    to: number;
    body: string;
    createdOn?: Date;
    isPriority: boolean;
};

export type UserMessages = {
    [userId: number]: Message[];
};

export type ActiveClients = Map<number, WebSocket>;

export enum MessageEvent {
    CONNECTION = "connection",
    MESSAGE = "message",
    CLOSE = "close",
}
