import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { AuthenticationRepository } from "../repositories/authentication_repository";
import * as bcrypt from "bcrypt";
import { User } from "../entities/user";
import * as jwt from "jsonwebtoken";
import { Token } from "../entities/token";

@injectable()
export class AuthenticationService {
    constructor(
        @inject("Repository")
        @named("AuthenticationRepository")
        private readonly authenticationRepository: AuthenticationRepository,
    ) {}

    async createUser(user: User): Promise<Token> {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const hashedUser = {
            ...user,
            password: hashedPassword,
        } as User;

        const userId = await this.authenticationRepository.createUser(hashedUser);
        return this.generateToken(userId);
    }

    async createSession(email: string, password: string): Promise<Token> {
        const user = await this.authenticationRepository.getUserByEmail(email);
        if (!user) {
            throw new Error("Invalid email and / or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid email and / or password");
        }

        return this.generateToken(user.userId);
    }

    private async generateToken(userId: string): Promise<Token> {
        return jwt.sign(
            {
                userId,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" },
        );
    }
}
