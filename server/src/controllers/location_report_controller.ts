import "reflect-metadata";
import { Controller, interfaces, Post } from "inversify-restify-utils";
import { inject, injectable, named } from "inversify";
import { Request, Response } from "restify";
import * as Joi from "joi";
import { LocationReportService } from "../services/location_report_service";

@Controller("/location_reports")
@injectable()
export class LocationReportController implements interfaces.Controller {
    constructor(
        @inject("Service")
        @named("LocationReportService")
        private readonly locationReportService: LocationReportService,
    ) {}

    @Post("/", "injectAuthDataMiddleware", "isValidPatientOrUserMiddleware")
    private async postLocationReport(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = postLocationReportSchema.validate({
                ...req.body,
            });

            if (error) {
                res.json(400, error);
                return;
            }

            await this.locationReportService.postLocationReport({
                patientId: req["token"].userId,
                createdOn: value.createdOn,
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

const postLocationReportSchema = Joi.object({
    createdOn: Joi.date().required(),
    streetAddress: Joi.string().required(),
    streetAddressLineTwo: Joi.string().required().allow(""),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    province: Joi.string().required(),
}).required();
