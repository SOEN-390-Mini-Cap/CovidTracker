import "reflect-metadata";
import { Controller, Get, interfaces, Post } from "inversify-restify-utils";
import { inject, injectable, named } from "inversify";
import { Request, Response } from "restify";
import * as Joi from "joi";
import { TestService } from "../services/test_service";
import { RequestAddress } from "../entities/request/RequestAddress";
import { TestResultTypes } from "../entities/test_result_type";
import { TestTypes } from "../entities/test_type";

@Controller("/tests")
@injectable()
export class TestController implements interfaces.Controller {
    constructor(
        @inject("Service")
        @named("TestService")
        private readonly testService: TestService,
    ) {}

    @Get("/:testId", "injectAuthDataMiddleware")
    private async getTestResult(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = getTestResultSchema.validate({
                ...req.params,
            });

            if (error) {
                res.json(400, error);
                return;
            }

            const data = await this.testService.getTestResult(value.testId, req["token"].userId, req["token"].role);
            res.json(200, data);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }

    @Get("/patients/:patientId", "injectAuthDataMiddleware")
    private async getPatientTests(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = getPatientTestSchema.validate({
                ...req.params,
            });

            if (error) {
                res.json(400, error);
                return;
            }

            const testList = await this.testService.getPatientTests(
                value.patientId,
                req["token"].userId,
                req["token"].role,
            );

            res.json(200, testList);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }

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

            await this.testService.postTestResult(
                value.result,
                value.testType,
                value.testDate,
                addressData,
                value.patientId,
                req["token"].userId,
                req["token"].role,
            );

            res.json(201);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }
}

const postTestResultsSchema = Joi.object({
    result: Joi.string()
        .valid(...TestResultTypes)
        .required(),
    testType: Joi.string()
        .valid(...TestTypes)
        .required(),
    testDate: Joi.date().required(),
    streetAddress: Joi.string().required(),
    streetAddressLineTwo: Joi.string().allow(null, ""),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    province: Joi.string().required(),
    patientId: Joi.number().required(),
}).required();

const getTestResultSchema = Joi.object({
    testId: Joi.number().required(),
}).required();

const getPatientTestSchema = Joi.object({
    patientId: Joi.number().required(),
}).required();
