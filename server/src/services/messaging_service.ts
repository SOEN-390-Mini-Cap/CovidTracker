import "reflect-metadata";
import { injectable } from "inversify";
import {Token} from "../entities/token";
import {IncomingMessage} from "http";

@injectable()
export class MessagingService {
    constructor() {}

    async parseConnectionJWT(req: IncomingMessage): Promise<Token> {
        return req.url.split("=")[1];
    }
}
