import { WebSocket } from "ws";

export type Message = {
    messageId?: number;
    from: number;
    to: number;
    body: string;
    createdOn: Date;
};

export type ActiveClients = Map<number, WebSocket>;

export enum MessageEvent {
    CONNECTION = "connection",
    MESSAGE = "message",
    CLOSE = "close",
}
