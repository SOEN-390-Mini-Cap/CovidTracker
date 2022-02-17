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

    @Post("/:patientId/doctors", "extractJwtMiddleware", "isValidAdminMiddleware")
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

    @Post("/:patientId/statuses/fields", "extractJwtMiddleware", "isValidDoctorMiddleware")
    private async setStatusFields(req: Request, res: Response): Promise<void> {
        try {
            const doctorId = req["token"].userId;
            const { value, error } = statusFieldsSchema.validate({
                patientId: req.params.patientId,
                fields: req.body,
            });

            if (error) {
                res.json(400, error);
                return;
            }

            await this.patientService.setStatusFields(doctorId, value.patientId, value.fields);

            res.json(201);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }

    @Get("/:patientId/statuses/fields", "extractJwtMiddleware", "isValidPatientMiddleware")
    private async getPatientStatusFields(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = patientSchema.validate({ patientId: req.params.patientId });

            const isSamePatient = req["token"].userId === value.patientId;

            if (!isSamePatient || error) {
                res.json(400, error);
                return;
            }

            const statusFields = await this.patientService.getPatientStatusFields(value.patientId);

            res.json(201, statusFields);
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
    patientId: Joi.number().required(),
    fields: Joi.object().pattern(/^/, Joi.bool()).required(),
}).required();

const patientSchema = Joi.object({ patientId: Joi.number().required() }).required();
