import "reflect-metadata";
import { Controller, Get, interfaces, Post } from "inversify-restify-utils";
import { inject, injectable, named } from "inversify";
import { Request, Response } from "restify";
import * as Joi from "joi";
import { MessageService } from "../services/message_service";

@Controller("/messages")
@injectable()
export class MessageController implements interfaces.Controller {
    constructor(
        @inject("Service")
        @named("MessageService")
        private readonly messageService: MessageService,
    ) {}

    @Post("/", "injectAuthDataMiddleware")
    private async postMessage(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = postMessageSchema.validate({
                ...req.body,
            });

            if (error) {
                res.json(400, error);
                return;
            }

            await this.messageService.postMessage({
                from: req["token"].userId,
                to: value.to,
                body: value.body,
                isPriority: value.isPriority,
            });

            res.json(201);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }

    @Get("/", "injectAuthDataMiddleware")
    private async getMessages(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = getMessagesSchema.validate({
                userId: req.query.userId,
            });

            if (error) {
                res.json(400, error);
                return;
            }

            const chat = await this.messageService.getMessagesAdapter(req["token"], value.userId);

            res.json(200, chat);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }

    @Get("/chats", "injectAuthDataMiddleware")
    private async getChats(req: Request, res: Response): Promise<void> {
        try {
            const chatContacts = await this.messageService.getChatsAdapter(req["token"]);

            res.json(200, chatContacts);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }
}

const getMessagesSchema = Joi.object({
    userId: Joi.number().required(),
}).required();

const postMessageSchema = Joi.object({
    to: Joi.number().required(),
    body: Joi.string().required(),
    isPriority: Joi.bool().required(),
}).required();
