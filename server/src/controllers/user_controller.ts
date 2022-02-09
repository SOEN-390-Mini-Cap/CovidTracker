import "reflect-metadata";
import { Request, Response } from "restify";
import { Controller, Get, interfaces, Put } from "inversify-restify-utils";
import { inject, injectable, named } from "inversify";
import { UserService } from "../services/user_service";
import { extractJWTAuthMiddleware } from "./auth_middleware";
import { AuthorizationError } from "../entities/errors/authorization_error";
import * as Joi from "joi";
import {ROLES} from "../entities/role";

@Controller("/users")
@injectable()
export class UserController implements interfaces.Controller {
    constructor(
        @inject("Service")
        @named("UserService")
        private readonly userService: UserService,
    ) {}

    @Get("/me", extractJWTAuthMiddleware)
    private async me(req: Request, res: Response): Promise<void> {
        try {
            const userId = req["token"].userId;
            const user = await this.userService.findUserByUserId(userId);

            user.account.password = "";
            res.json(200, user);
        } catch (error) {
            if (error instanceof AuthorizationError) {
                res.json(error.statusCode, { error: error.toString() });
            } else {
                res.json(500, { error: error.toString() });
            }
        }
    }

    @Put("/:userId/roles")
    private async assignRole(req: Request, res: Response): Promise<void> {
        const userId = req.params.userId;
        const { value, error } = roleSchema.validate(req.body);

        if (error || !userId) {
            res.json(400, error);
            return;
        }

        console.log(userId, value.role);
        res.json(204);
    }
}

const roleSchema = Joi.object({
    role: Joi.string()
        .valid(...ROLES)
        .required(),
}).required();
