import "reflect-metadata";
import { Request, Response } from "restify";
import { Controller, Post, interfaces, Get, Put } from "inversify-restify-utils";
import { inject, injectable, named } from "inversify";
import * as Joi from "joi";
import { PatientService } from "../services/patient_service";
import { TestResultTypes } from "../entities/test_result_type";

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

    @Put("/:patientId/prioritize", "injectAuthDataMiddleware")
    async putPatientPrioritized(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = putPatientPrioritizedSchema.validate({
                patientId: req.params.patientId,
                isPrioritized: req.body.isPrioritized,
            });

            if (error) {
                res.json(400, error);
                return;
            }

            await this.patientService.putPatientPrioritized(req["token"], value.patientId, value.isPrioritized);

            res.json(204);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }

    @Get("/", "injectAuthDataMiddleware")
    async getPatients(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = patientFilterSchema.validate({
                status: req.query.status?.toUpperCase(),
                testDateFrom: req.query.testDateFrom,
                testDateTo: req.query.testDateTo,
            });

            if (error) {
                res.json(400, error);
                return;
            }

            const patients = await this.patientService.getPatientsStrategy(req["token"], value)();
            res.json(200, patients);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }
}

const doctorSchema = Joi.object({
    patientId: Joi.number().required(),
    doctorId: Joi.number().required(),
}).required();

const putPatientPrioritizedSchema = Joi.object({
    patientId: Joi.number().required(),
    isPrioritized: Joi.bool().required(),
}).required();

const patientFilterSchema = Joi.object({
    status: Joi.string().valid(...TestResultTypes),
    testDateFrom: Joi.date().iso(),
    testDateTo: Joi.date().iso(),
}).required();
