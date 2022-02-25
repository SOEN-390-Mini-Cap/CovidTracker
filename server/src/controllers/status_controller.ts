import "reflect-metadata";
import { Request, Response } from "restify";
import { Controller, Post, interfaces, Get } from "inversify-restify-utils";
import { inject, injectable, named } from "inversify";
import * as Joi from "joi";
import {StatusService} from "../services/status_service";

@Controller("/statuses")
@injectable()
export class StatusController implements interfaces.Controller {
    constructor(
        @inject("Service")
        @named("StatusService")
        private readonly statusService: StatusService,
    ) {}

    @Post("/patients/:patientId", "injectAuthDataMiddleware", "isValidPatientMiddleware")
    private async postStatus(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = postStatusSchema.validate({
                status: req.body,
                patientId: req.params.patientId,
            });

            if (error) {
                res.json(400, error);
                return;
            }

            await this.statusService.postStatus(req["token"].userId, value.patientId, value.status);

            res.json(201);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }

    @Get("/:statusId", "injectAuthDataMiddleware")
    private async getStatus(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = getStatusSchema.validate({
                statusId: req.params.statusId,
            });

            if (error) {
                res.json(400, error);
                return;
            }

            const status = await this.statusService.getStatus(value.statusId, req["token"].userId, req["token"].role);

            res.json(200, status);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }
}

const postStatusSchema = Joi.object({
    status: Joi.object().required(),
    patientId: Joi.number().required(),
}).required();

const getStatusSchema = Joi.object({
    statusId: Joi.number().required(),
}).required();
