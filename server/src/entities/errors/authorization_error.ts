export class AuthorizationError extends Error {
    public readonly statusCode = 403;
    constructor() {
        super("User not authorized");
    }
}
