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

        const token = await this.authenticationService.createUser(user);
        res.send(201, token);
    }

    @Post("/sign_in")
    private async signIn(req: Request, res: Response): Promise<void> {
        const { email, password } = await signInSchema.validateAsync(req.body).catch((error) => {
            res.json(400, error);
            return;
        });

        const token = await this.authenticationService.createSession(email, password);
        res.json(200, { token });
    }
}

const signUpSchema = Joi.object({
    email: Joi.string().email(),
    // Password requires upper case and lower case letter as well as number and special character.
    password: Joi.string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()?+=_]).{8,30}$"))
        .required(),
    firstName: Joi.string().pattern(new RegExp("^[A-Za-z]+")).min(1).max(25).required(),
    lastName: Joi.string().pattern(new RegExp("^[A-Za-z]+")).min(1).max(25).required(),
    dateOfBirth: Joi.date().iso().required(),
});

const signInSchema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()?+=_]).{8,30}$"))
        .required(),
});
