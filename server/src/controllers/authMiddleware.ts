import { Next, Request, Response } from "restify";
import * as jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user_repository";
import { Role } from "../entities/role";
import { container } from "../registry";

type CallbackMiddleware = (req: Request, res: Response, next: Next) => void;

function extractJWTAuthMiddleware(req: Request, res: Response, next: Next): void {
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
            userId: payload["userId"],
        };
        next();
    });
}

function accessRightsMiddleware(roles: Role[]): CallbackMiddleware {
    return async (req: Request, res: Response, next: Next) => {
        const user = await container
            .getNamed<UserRepository>("Repository", "UserRepository")
            .findUserByUserId(req["token"].userId);
        if (!user.roles.some((r) => roles.includes(r))) {
            res.json(401);
            return;
        }

        next();
    };
}

export { extractJWTAuthMiddleware, accessRightsMiddleware };
