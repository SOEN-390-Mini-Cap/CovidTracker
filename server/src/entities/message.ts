import { WebSocket } from "ws";

export type Message = {
    to: number;
    body: string;
};

export type ActiveClients = Map<number, WebSocket>;

export enum MessageEvent {
    CONNECTION = "connection",
    MESSAGE = "message",
    CLOSE = "close",
}
