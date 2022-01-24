import "reflect-metadata";
import * as restify from "restify";
import { Controller, interfaces, Post } from "inversify-restify-utils";
import { inject, injectable, named } from "inversify";
import { AuthenticationService } from "../services/authentication_service";
import * as Joi from "joi";

@Controller("/")
@injectable()
export class AuthenticationController implements interfaces.Controller {
    constructor(
        @inject("Service")
        @named("AuthenticationService")
        private readonly _authenticationService: AuthenticationService,
    ) {}

    @Post("/signup")
    private async signUp(req: restify.Request, res: restify.Response): Promise<any> {
        const schema: Joi.ObjectSchema = Joi.object({
            email: Joi.string().email(),
            // Password requires upper case and lower case letter as well as number and special character.
            password: Joi.string()
                .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()?+=_]).{8,30}$"))
                .required(),
            first_name: Joi.string().pattern(new RegExp("^[A-Za-z]+")).min(2).max(25).required(),
            last_name: Joi.string().pattern(new RegExp("^[A-Za-z]+")).min(2).max(25).required(),
            date_of_birth: Joi.date().required(),
            created_on: Joi.date().timestamp(),
        });

        const { error } = await schema.validateAsync(req.body);

        if (!req.is("application/json") || error) {
            // indicate error
            return res.send(400, error || "Data is not in json format.");
        }

        const e = await this._authenticationService.createUser(req.body);
        if (!e) {
            return res.send(200, "New user has been created.");
        }
        return res.send(500, "New user was not created.");
    }
}
