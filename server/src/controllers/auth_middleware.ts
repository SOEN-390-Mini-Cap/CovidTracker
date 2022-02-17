import { Next, Request, RequestHandler, Response } from "restify";
import * as jwt from "jsonwebtoken";
import { Role } from "../entities/role";
import { UserService } from "../services/user_service";
import {Container} from "inversify";
import {UserRepository} from "../repositories/user_repository";
import {PatientRepository} from "../repositories/patient_repository";
import {DoctorRepository} from "../repositories/doctor_repository";
import {AdminRepository} from "../repositories/admin_repository";
import {HealthOfficialRepository} from "../repositories/health_official_repository";
import {ImmigrationOfficerRepository} from "../repositories/immigration_officer_repository";
import {User} from "../entities/user";

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
            userId: +payload["userId"],
        };
        next();
    });
}

function isValidRoleMiddleware(roles: Role[]) {
    return (container: Container): RequestHandler => {
        return async (req: Request, res: Response, next: Next): Promise<void> => {
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
                };
                next();
            } catch (error) {
                res.json(500, { error: error.message });
            }
        };
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

export { extractJwtMiddleware, isValidRoleMiddleware, isSamePatientMiddleware };
