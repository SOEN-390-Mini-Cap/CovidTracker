import "reflect-metadata";
import * as restify from "restify";
import { Controller, interfaces, Post } from "inversify-restify-utils";
import { injectable } from "inversify";
import { AuthenticationService } from "../services/AuthenticationService";
import * as Joi from "joi";

@Controller("/")
@injectable()
export class AuthenticationController implements interfaces.Controller {
    private readonly _authenticationService: AuthenticationService;

    constructor(_authService: AuthenticationService) {
        this._authenticationService = _authService;
    }

    @Post("/signup")
    private async signUp(req: restify.Request, res: restify.Response): Promise<any> {
        //To Do: implement actual data validation.
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

        await this._authenticationService.createUser(req.body);
        return res.send(200, req.body.email);
    }
}
