import "reflect-metadata";
import { Request, Response } from "restify";
import { Controller, Get, interfaces } from "inversify-restify-utils";
import { inject, injectable, named } from "inversify";
import { extractJWTAuthMiddleware } from "./auth_utils";
import { UserService } from "../services/user_service";

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
            res.json(500, { error: error.toString() });
        }
    }
}
