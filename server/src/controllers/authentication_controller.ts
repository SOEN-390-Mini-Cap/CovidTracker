import "reflect-metadata";
import { Request, Response } from "restify";
import { Controller, interfaces, Post } from "inversify-restify-utils";
import { inject, injectable, named } from "inversify";
import { AuthenticationService } from "../services/authentication_service";
import * as Joi from "joi";
import { GENDERS } from "../entities/gender";
import { RequestUser } from "../entities/request/RequestUser";
import { RequestAddress } from "../entities/request/RequestAddress";

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
        const { value, error } = signUpSchema.validate(req.body);

        if (error) {
            res.json(400, error);
            return;
        }

        const userData: RequestUser = {
            firstName: value.firstName,
            lastName: value.lastName,
            phoneNumber: value.phoneNumber,
            gender: value.gender,
            dateOfBirth: value.dateOfBirth,
            email: value.email,
            password: value.password,
        };
        const addressData: RequestAddress = {
            streetAddress: value.streetAddress,
            streetAddressLineTwo: value.streetAddressLineTwo || "",
            city: value.city,
            postalCode: value.postalCode,
            province: value.province,
            country: "canada",
        };

        await this.authenticationService
            .signUp(userData, addressData)
            .then((token) => res.json(201, { token }))
            .catch((error) => res.json(500, { error: error.toString() }));
    }

    @Post("/sign_in")
    private async signIn(req: Request, res: Response): Promise<void> {
        const { value, error } = signInSchema.validate(req.body);

        if (error) {
            res.json(400, error);
            return;
        }

        await this.authenticationService
            .signIn(value.email, value.password)
            .then((token) => res.json(200, { token }))
            .catch((error) => res.json(500, { error: error.toString() }));
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
    streetAddressLineTwo: Joi.string().allow(null, ""),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    province: Joi.string().required(),
    email: Joi.string().email().required(),
    password: passwordSchema,
}).required();

const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: passwordSchema,
}).required();
