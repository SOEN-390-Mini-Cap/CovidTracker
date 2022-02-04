import "reflect-metadata";
import { Request, Response } from "restify";
import { Controller, Get, interfaces } from "inversify-restify-utils";
import { inject, injectable, named } from "inversify";
import { authMiddleware } from "./auth_utils";
import { UserService } from "../services/user_service";

@Controller("/users")
@injectable()
export class UserController implements interfaces.Controller {
    constructor(
        @inject("Service")
        @named("UserService")
        private readonly userService: UserService,
    ) {}

    @Get("/me", authMiddleware)
    private async me(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user.userId;
            const user = await this.userService.findUserByUserId(userId);

            res.json(200, {
                ...user,
                password: "",
            });
        } catch (error) {
            res.json(500, { error: error.toString() });
        }
    }
}
