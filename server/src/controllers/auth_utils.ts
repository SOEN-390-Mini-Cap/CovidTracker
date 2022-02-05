import { Request, Response, Next } from "restify";
import * as jwt from "jsonwebtoken";

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

export { extractJWTAuthMiddleware };
