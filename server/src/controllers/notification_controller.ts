import "reflect-metadata";
import { Request, Response } from "restify";
import { Controller, interfaces, Post } from "inversify-restify-utils";
import { inject, injectable, named } from "inversify";
import { NotificationService } from "../services/notification_service";
import * as Joi from "joi";

@Controller("/notifications")
@injectable()
export class NotificationController implements interfaces.Controller {
    constructor(
        @inject("Service")
        @named("NotificationService")
        private readonly notificationService: NotificationService,
    ) {}

    @Post("/sms", "injectAuthDataMiddleware")
    private async postSMS(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = postSMSSchema.validate({
                ...req.body,
            });

            if (error) {
                res.json(400, error);
                return;
            }

            await this.notificationService.sendSMS(value.userId, value.body);

            res.json(201);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }

    @Post("/email", "injectAuthDataMiddleware")
    private async postEmail(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = postEmailSchema.validate({
                ...req.body,
            });

            if (error) {
                res.json(400, error);
                return;
            }

            await this.notificationService.sendEmail(value.userId, value.subject, value.body);

            res.json(201);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }
}

const postSMSSchema = Joi.object({
    userId: Joi.number().required(),
    body: Joi.string().required(),
}).required();

const postEmailSchema = Joi.object({
    userId: Joi.number().required(),
    subject: Joi.string().required(),
    body: Joi.string().required(),
}).required();
