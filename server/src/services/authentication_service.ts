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

    async createUser(_body: any) {
        const { email, password, firstName, lastName, dateOfBirth }: User = _body;
        const salt: string = bcrypt.genSaltSync(8);
        const hash: string = await bcrypt.hash(password, salt);
        return this.authenticationRepository.createUser(email, hash, firstName, lastName, dateOfBirth);
    }

    async createSession(email: string, password: string): Promise<Token> {
        const user = await this.authenticationRepository.getUserByEmail(email);
        console.log(user);

        if (!user) {
            throw new Error("no user");
        }

        const isMatch = await bcrypt.compare(password, user.password).catch(e => {
            console.log("error in compare", user.password);
            throw new Error("here");
        });

        if (!isMatch) {
            throw new Error("no match");
        }

        return this.generateToken(user.userId);
    }

    private async generateToken(userId: string): Promise<Token> {
        return jwt.sign(
            {
                userId,
            },
            "secret",
            { expiresIn: "1h" },
        );
    }
}
