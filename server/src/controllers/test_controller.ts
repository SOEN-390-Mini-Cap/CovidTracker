import { Controller, interfaces, Post } from "inversify-restify-utils";
import { inject, injectable, named } from "inversify";
import { DoctorService } from "../services/doctor_service";
import { Request, Response } from "restify";
import * as Joi from "joi";
import { TestService } from "../services/test_service";
import { ROLES } from "../entities/role";

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
                results: req.body,
                patiendId: req.params.patiendId,
                currentUserId: req["token"].userId,
                currentUserRole: req["token"].role,
            });

            if (error) {
                res.json(400, error);
                return;
            }

            await this.testService.addTestResults(
                value.results,
                value.patientId,
                value.currentUserId,
                value.currentUserRole,
            );

            res.json(200);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }
}

const postTestResultsSchema = Joi.object({
    results: Joi.object().required(),
    patientId: Joi.number().required(),
    currentUserId: Joi.number().required(),
    currentUserRole: Joi.string()
        .valid(...ROLES)
        .required(),
}).required();
