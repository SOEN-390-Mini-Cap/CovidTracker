import { Controller, interfaces, Post } from "inversify-restify-utils";
import { inject, injectable, named } from "inversify";
import { Request, Response } from "restify";
import * as Joi from "joi";
import { TestService } from "../services/test_service";
import { RequestAddress } from "../entities/request/RequestAddress";

@Controller("/tests")
@injectable()
export class TestController implements interfaces.Controller {
    constructor(
        @inject("Service")
        @named("TestService")
        private readonly testService: TestService,
    ) {}

    @Post("/patients/:patientId", "injectAuthDataMiddleware")
    private async postTestResult(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = postTestResultsSchema.validate({
                ...req.body,
                ...req.params,
            });

            if (error) {
                res.json(400, error);
                return;
            }

            const addressData: RequestAddress = {
                streetAddress: value.streetAddress,
                streetAddressLineTwo: value.streetAddressLineTwo || "",
                city: value.city,
                postalCode: value.postalCode,
                province: value.province,
                country: "Canada",
            };

            await this.testService.addTestResults(
                value.testResult,
                value.typeOfTest,
                value.dateOfTest,
                addressData,
                value.patientId,
                req["token"].userId,
                req["token"].role,
            );

            res.json(200);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }
}

const postTestResultsSchema = Joi.object({
    testResult: Joi.string().required(),
    typeOfTest: Joi.string().required(),
    dateOfTest: Joi.date().required(),
    streetAddress: Joi.string().required(),
    streetAddressLineTwo: Joi.string().allow(null, ""),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    province: Joi.string().required(),
    patientId: Joi.number().required(),
}).required();
