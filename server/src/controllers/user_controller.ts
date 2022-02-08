import "reflect-metadata";
import { Request, Response } from "restify";
import { Controller, Get, interfaces } from "inversify-restify-utils";
import { inject, injectable, named } from "inversify";
import { UserService } from "../services/user_service";
import { extractJWTAuthMiddleware } from "./auth_Middleware";
import { AuthorizationError } from "../entities/Error/AuthorizationError";

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

            res.json(200, {
                ...user,
                password: "",
            });
        } catch (error) {
            if (error instanceof AuthorizationError) {
                res.json(error.statusCode, { error: error.toString() });
            } else {
                res.json(500, { error: error.toString() });
            }
        }
    }
}
