import * as jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            console.log(user);

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

export { authMiddleware };
