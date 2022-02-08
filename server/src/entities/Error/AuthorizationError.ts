export class AuthorizationError extends Error {
    public readonly statusCode = 401;
    constructor() {
        super("User not authorized");
    }
}
