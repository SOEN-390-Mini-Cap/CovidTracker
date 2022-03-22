import "reflect-metadata";
import { Controller, interfaces, Post } from "inversify-restify-utils";
import { inject, injectable, named } from "inversify";
import { Request, Response } from "restify";
import * as Joi from "joi";
import { AppointmentService } from "../services/appointment_service";

@Controller("/appointments")
@injectable()
export class AppointmentController implements interfaces.Controller {
    constructor(
        @inject("Service")
        @named("AppointmentService")
        private readonly appointmentService: AppointmentService,
    ) {}

    @Post("/", "injectAuthDataMiddleware")
    private async postAppointments(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = postAppointmentSchema.validate({
                ...req.body,
            });

            if (error) {
                res.json(400, error);
                return;
            }

            await this.appointmentService.postAppointment(req["token"], {
                doctorId: req["token"].userId,
                patientId: value.patientId,
                startDate: value.startDate,
                endDate: value.endDate,
                address: {
                    streetAddress: value.streetAddress,
                    streetAddressLineTwo: value.streetAddressLineTwo,
                    city: value.city,
                    postalCode: value.postalCode,
                    province: value.province,
                    country: "Canada",
                },
            });

            res.json(201);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }
}

const postAppointmentSchema = Joi.object({
    patientId: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    streetAddress: Joi.string().required(),
    streetAddressLineTwo: Joi.string().required().allow(""),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    province: Joi.string().required(),
}).required();
