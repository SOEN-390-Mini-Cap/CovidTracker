import {Next, Request, RequestHandler, Response} from "restify";
import * as jwt from "jsonwebtoken";
import {Role} from "../entities/role";
import {container} from "../registry";
import {UserRepository} from "../repositories/user_repository";
import {UserService} from "../services/user_service";

function extractJwtMiddleware(req: Request, res: Response, next: Next): void {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.json(401);
        return;
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            res.json(403);
            return;
        }

        req["token"] = {
            ...req["token"],
            userId: payload["userId"],
        };
        next();
    });
}

function isValidRoleMiddleware(roles: Role[]): RequestHandler {
    const userService = container.getNamed<UserService>("Service", "UserService");

    return async function (req: Request, res: Response, next: Next): Promise<void> {
        try {
            const userId = req["token"].userId;
            const role = await userService.findUserRoleById(userId);

            const isRoleValid = roles.includes(role);
            if (!isRoleValid) {
                res.json(403, `Role ${role} is not valid for this operation`);
                return;
            }

            req["token"] = {
                ...req["token"],
                role,
            };
            next();
        } catch (error) {
            res.json(500, { error: error.message });
        }
    };
}

export { extractJwtMiddleware, isValidRoleMiddleware };
