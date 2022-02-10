export class AuthenticationError extends Error {
    public readonly statusCode = 401;
    constructor() {
        super("User not authenticated");
    }
}
