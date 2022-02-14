import "reflect-metadata";
import { Request, Response } from "restify";
import { Controller, Post, interfaces } from "inversify-restify-utils";
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
}

const statusFieldsSchema = Joi.object({
    patientId: Joi.number().required(),
    fields: Joi.object().pattern(/^/, Joi.bool()).required(),
}).required();
