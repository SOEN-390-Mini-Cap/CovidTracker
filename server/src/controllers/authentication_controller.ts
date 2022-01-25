import "reflect-metadata";
import { Request, Response } from "restify";
import { Controller, interfaces, Post } from "inversify-restify-utils";
import { inject, injectable, named } from "inversify";
import { AuthenticationService } from "../services/authentication_service";
import * as Joi from "joi";
import { User } from "../entities/user";

@Controller("/")
@injectable()
export class AuthenticationController implements interfaces.Controller {
    constructor(
        @inject("Service")
        @named("AuthenticationService")
        private readonly authenticationService: AuthenticationService,
    ) {}

    @Post("/sign_up")
    private async signUp(req: Request, res: Response): Promise<any> {
        const user = (await signUpSchema.validateAsync(req.body).catch((error) => {
            res.json(400, error);
            return;
        })) as User;

        const token = await this.authenticationService.createUser(user).catch((error) => {
            res.json(500, { error: error.toString() });
            return;
        });
        res.send(201, { token });
    }

    @Post("/sign_in")
    private async signIn(req: Request, res: Response): Promise<void> {
        const { email, password } = await signInSchema.validateAsync(req.body).catch((error) => {
            res.json(400, error);
            return;
        });

        const token = await this.authenticationService.createSession(email, password).catch((error) => {
            console.log(error);
            res.json(500, { error: error.toString() });
            return;
        });
        res.json(200, { token });
    }
}

// Password requires at least 1 upper case, 1 lower case letter, 1 number, 1 special character, and
// has a minimum length of 8 characters
const passwordSchema = Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()?+=_]).{8,30}$"))
    .required();

const signUpSchema = Joi.object({
    email: Joi.string().email(),
    password: passwordSchema,
    firstName: Joi.string().pattern(new RegExp("^[A-Za-z]+")).min(1).max(25).required(),
    lastName: Joi.string().pattern(new RegExp("^[A-Za-z]+")).min(1).max(25).required(),
    dateOfBirth: Joi.date().iso().required(),
});

const signInSchema = Joi.object({
    email: Joi.string().email(),
    password: passwordSchema,
});
