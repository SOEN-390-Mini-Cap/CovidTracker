import "reflect-metadata";
import { Request, Response } from "restify";
import { Controller, Get, interfaces, Put } from "inversify-restify-utils";
import { inject, injectable, named } from "inversify";
import { UserService } from "../services/user_service";
import * as Joi from "joi";
import { ROLES } from "../entities/role";

@Controller("/users")
@injectable()
export class UserController implements interfaces.Controller {
    constructor(
        @inject("Service")
        @named("UserService")
        private readonly userService: UserService,
    ) {}

    @Get("/me", "injectAuthDataMiddleware")
    private async me(req: Request, res: Response): Promise<void> {
        try {
            const userId = req["token"].userId;
            const user = await this.userService.findUserByUserId(userId);

            user.account.password = "";
            res.json(200, user);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }

    @Put("/:userId/roles", "injectAuthDataMiddleware", "isValidAdminMiddleware")
    private async assignRole(req: Request, res: Response): Promise<void> {
        try {
            const { value, error } = roleSchema.validate({
                ...req.params,
                ...req.body,
            });

            if (error) {
                res.json(400, error);
                return;
            }

            await this.userService.assignRole(value.userId, value.role);

            res.json(204);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }
}

const roleSchema = Joi.object({
    userId: Joi.number().required(),
    role: Joi.string()
        .valid(...ROLES)
        .required(),
}).required();
