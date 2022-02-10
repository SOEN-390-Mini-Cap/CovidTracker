import { Next, Request, RequestHandler, Response } from "restify";
import * as jwt from "jsonwebtoken";
import { Role } from "../entities/role";
import { container } from "../registry";
import { UserService } from "../services/user_service";

function extractJwtMiddleware(req: Request, res: Response, next: Next): void {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.json(401, "No authorization header found");
        return;
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            res.json(403, "Invalid token provided");
            return;
        }

        req["token"] = {
            ...req["token"],
            userId: payload["userId"],
        };
        next();
    });
}

const isValidAdminMiddleware = isValidRoleMiddleware([Role.ADMIN]);

function isValidRoleMiddleware(roles: Role[]): RequestHandler {
    return async function (req: Request, res: Response, next: Next): Promise<void> {
        try {
            const userService = container.getNamed<UserService>("Service", "UserService");

            const userId = req["token"].userId;
            const role = await userService.findRoleByUserId(userId);

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

export { extractJwtMiddleware, isValidAdminMiddleware };
