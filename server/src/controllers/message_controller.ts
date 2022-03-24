import "reflect-metadata";
import { Controller, Get, interfaces } from "inversify-restify-utils";
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

            const chat = await this.messageService.getMessages(req["token"], value.userId);

            res.json(200, chat);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }

    @Get("/chats", "injectAuthDataMiddleware")
    private async getChats(req: Request, res: Response): Promise<void> {
        try {
            const chatContacts = await this.messageService.getChats(req["token"]);

            res.json(200, chatContacts);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }
}

const getMessagesSchema = Joi.object({
    userId: Joi.number().required(),
}).required();
