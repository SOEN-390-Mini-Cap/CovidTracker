import "reflect-metadata";
import { Request, Response } from "restify";
import { Controller, Post, interfaces, Get } from "inversify-restify-utils";
import { inject, injectable, named } from "inversify";
import * as Joi from "joi";
import { PatientService } from "../services/patient_service";

@Controller("/patients")
@injectable()
export class PatientController implements interfaces.Controller {
    constructor(
        @inject("Service")
        @named("PatientService")
        private readonly patientService: PatientService,
    ) {}

    @Post("/:patientId/doctors", "injectAuthDataMiddleware", "isValidAdminMiddleware")
    async assignDoctor(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = doctorSchema.validate({
                ...req.params,
                ...req.body,
            });

            if (error) {
                res.json(400, error);
                return;
            }

            await this.patientService.assignDoctor(value.patientId, value.doctorId);

            res.json(201);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }

    @Post("/:patientId/statuses/fields", "injectAuthDataMiddleware", "isValidDoctorMiddleware")
    private async setStatusFields(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = statusFieldsSchema.validate({
                doctorId: req["token"].userId,
                patientId: req.params.patientId,
                fields: req.body,
            });

            if (error) {
                res.json(400, error);
                return;
            }

            await this.patientService.setStatusFields(value.doctorId, value.patientId, value.fields);

            res.json(201);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }

    @Get("/:patientId/statuses/fields", "injectAuthDataMiddleware", "isValidPatientMiddleware")
    private async getPatientStatusFields(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = patientSchema.validate({ patientId: req.params.patientId });

            if (error) {
                res.json(400, error);
                return;
            }

            const statusFields = await this.patientService.getPatientStatusFields(req["token"].userId, value.patientId);

            res.json(200, statusFields);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }
}

const doctorSchema = Joi.object({
    patientId: Joi.number().required(),
    doctorId: Joi.number().required(),
}).required();

const statusFieldsSchema = Joi.object({
    doctorId: Joi.number().required(),
    patientId: Joi.number().required(),
    fields: Joi.object().pattern(/^/, Joi.bool()).required(),
}).required();

const patientSchema = Joi.object({ patientId: Joi.number().required() }).required();
