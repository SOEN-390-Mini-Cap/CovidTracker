import { Next, Request, Response } from "restify";
import * as jwt from "jsonwebtoken";
import { Role } from "../entities/role";
import { UserService } from "../services/user_service";
import { Container } from "inversify";

function injectAuthDataMiddleware(container: Container) {
    return async (req: Request, res: Response, next: Next): Promise<void> => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.json(401, "No authorization header found");
            return;
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
            if (err) {
                res.json(403, "Invalid token provided");
                return;
            }

            const userService = container.getNamed<UserService>("Service", "UserService");

            const userId = +payload["userId"];
            const role = await userService.findRoleByUserId(userId);

            req["token"] = {
                ...req["token"],
                userId,
                role,
            };
            next();
        });
    };
}

function isValidRoleMiddleware(roles: Role[]) {
    return async (req: Request, res: Response, next: Next): Promise<void> => {
        try {
            const role = req["token"].role;

            const isRoleValid = roles.includes(role);
            if (!isRoleValid) {
                res.json(403, `Role ${role} is not valid for this operation`);
                return;
            }

            next();
        } catch (error) {
            res.json(500, { error: error.message });
        }
    };
}

function isSamePatientMiddleware(req: Request, res: Response, next: Next): void {
    const userId = req["token"].userId;
    const requestPatientId = +req.params.patientId;

    if (userId !== requestPatientId) {
        res.json(403, `Patient ${userId} is different than patientId in request`);
    }

    next();
}

export { injectAuthDataMiddleware, isValidRoleMiddleware, isSamePatientMiddleware };
