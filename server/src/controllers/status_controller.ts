import "reflect-metadata";
import { Request, Response } from "restify";
import { Controller, Post, interfaces, Get, Put } from "inversify-restify-utils";
import { inject, injectable, named } from "inversify";
import * as Joi from "joi";
import { StatusService } from "../services/status_service";
import {SMSGateway} from "../gateways/SMSGateway";

@Controller("/statuses")
@injectable()
export class StatusController implements interfaces.Controller {
    constructor(
        @inject("Service")
        @named("StatusService")
        private readonly statusService: StatusService,
        @inject("Gateway")
        @named("SMSGateway")
        private readonly smsGateway: SMSGateway,
    ) {}

    @Get("/", "injectAuthDataMiddleware")
    private async getStatuses(req: Request, res: Response): Promise<void> {
        try {
            this.smsGateway.sendSMS({
                body: "test message",
                to: null,
            });
            const statuses = await this.statusService.getStatusesStrategy(req["token"])();

            res.json(200, statuses);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }

    @Post("/patients/:patientId", "injectAuthDataMiddleware", "isValidPatientMiddleware")
    private async postStatus(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = postStatusSchema.validate({
                statusBody: req.body,
                patientId: req.params.patientId,
            });

            if (error) {
                res.json(400, error);
                return;
            }

            await this.statusService.postStatus(req["token"].userId, value.patientId, value.statusBody);

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

    @Get("/patients/:patientId", "injectAuthDataMiddleware")
    private async getStatusesForPatient(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = getStatusesForPatientSchema.validate({
                patientId: req.params.patientId,
            });

            if (error) {
                res.json(400, error);
                return;
            }

            const statuses = await this.statusService.getStatusesForPatient(
                req["token"].userId,
                req["token"].role,
                value.patientId,
            );

            res.json(200, statuses);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }

    @Put("/:statusId/reviewed", "injectAuthDataMiddleware")
    private async putStatusReviewed(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = putStatusReviewedSchema.validate({
                statusId: req.params.statusId,
                isReviewed: req.body.isReviewed,
            });

            if (error) {
                res.json(400, error);
                return;
            }

            await this.statusService.putStatusReviewed(req["token"], value.statusId, value.isReviewed);

            res.json(204);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }

    @Post("/fields/patients/:patientId", "injectAuthDataMiddleware", "isValidDoctorMiddleware")
    private async postStatusFields(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = postStatusFieldsSchema.validate({
                doctorId: req["token"].userId,
                patientId: req.params.patientId,
                fields: req.body,
            });

            if (error) {
                res.json(400, error);
                return;
            }

            await this.statusService.postStatusFields(value.doctorId, value.patientId, value.fields);

            res.json(201);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }

    @Get("/fields/patients/:patientId", "injectAuthDataMiddleware", "isValidPatientMiddleware")
    private async getStatusFields(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = getStatusFieldsSchema.validate({ patientId: req.params.patientId });

            if (error) {
                res.json(400, error);
                return;
            }

            const statusFields = await this.statusService.getStatusFields(req["token"].userId, value.patientId);

            res.json(200, statusFields);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }
}

const postStatusSchema = Joi.object({
    statusBody: Joi.object().required(),
    patientId: Joi.number().required(),
}).required();

const getStatusSchema = Joi.object({
    statusId: Joi.number().required(),
}).required();

const getStatusesForPatientSchema = Joi.object({ patientId: Joi.number().required() }).required();

const postStatusFieldsSchema = Joi.object({
    doctorId: Joi.number().required(),
    patientId: Joi.number().required(),
    fields: Joi.object().pattern(/^/, Joi.bool()).required(),
}).required();

const getStatusFieldsSchema = Joi.object({ patientId: Joi.number().required() }).required();

const putStatusReviewedSchema = Joi.object({
    statusId: Joi.number().required(),
    isReviewed: Joi.bool().required(),
}).required();
