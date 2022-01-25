import "reflect-metadata";
import { Request, Response } from "restify";
import { Controller, interfaces, Post } from "inversify-restify-utils";
import { inject, injectable, named } from "inversify";
import { AuthenticationService } from "../services/authentication_service";
import * as Joi from "joi";
import { Gender, GENDERS } from "../entities/gender";

@Controller("/")
@injectable()
export class AuthenticationController implements interfaces.Controller {
    constructor(
        @inject("Service")
        @named("AuthenticationService")
        private readonly authenticationService: AuthenticationService,
    ) {}

    @Post("/sign_up")
    private async signUp(req: Request, res: Response): Promise<void> {
        const reqData = await signUpSchema.validateAsync(req.body).catch((error) => {
            res.json(400, { error });
            return;
        });

        const token = await this.authenticationService
            .signUp(
                {
                    firstName: reqData.firstName,
                    lastName: reqData.lastName,
                    phoneNumber: reqData.phoneNumber,
                    gender: reqData.gender,
                    dateOfBirth: reqData.dateOfBirth,
                    email: reqData.email,
                    password: reqData.password,
                },
                {
                    streetAddress: reqData.streetAddress,
                    streetAddressLineTwo: reqData.streetAddressLineTwo,
                    city: reqData.city,
                    postalCode: reqData.postalCode,
                    province: reqData.province,
                    country: "canada",
                },
            )
            .catch((error) => {
                res.json(500, { error: error.toString() });
                return;
            });

        res.send(201, { token });
    }

    @Post("/sign_in")
    private async signIn(req: Request, res: Response): Promise<void> {
        const { email, password } = await signInSchema.validateAsync(req.body).catch((error) => {
            res.json(400, { error });
            return;
        });

        const token = await this.authenticationService.signIn(email, password).catch((error) => {
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
    firstName: Joi.string().pattern(new RegExp("^[A-Za-z]+")).min(1).max(25).required(),
    lastName: Joi.string().pattern(new RegExp("^[A-Za-z]+")).min(1).max(25).required(),
    phoneNumber: Joi.string().length(10).regex(/^\d+$/).required(),
    gender: Joi.string()
        .valid(...GENDERS)
        .required(),
    dateOfBirth: Joi.date().iso().required(),
    streetAddress: Joi.string().required(),
    streetAddressLineTwo: Joi.string(),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    province: Joi.string().required(),
    email: Joi.string().email().required(),
    password: passwordSchema,
});

const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: passwordSchema,
});

export interface UserReqData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: Gender;
    dateOfBirth: Date;
}

export interface AddressReqData {
    streetAddress: string;
    streetAddressLineTwo?: string;
    city: string;
    postalCode: string;
    province: string;
    country: string;
}
