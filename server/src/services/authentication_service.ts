import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { UserRepository } from "../repositories/user_repository";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Token } from "../entities/token";
import { RequestUser } from "../entities/request/RequestUser";
import { RequestAddress } from "../entities/request/RequestAddress";

@injectable()
export class AuthenticationService {
    constructor(
        @inject("Repository")
        @named("UserRepository")
        private readonly userRepository: UserRepository,
    ) {}

    async signUp(userData: RequestUser, addressData: RequestAddress): Promise<Token> {
        const addressId = await this.userRepository.addAddress(addressData);

        userData.password = await bcrypt.hash(userData.password, 10);
        const userId = await this.userRepository.addUser(userData, addressId);

        return this.signToken(userId);
    }

    async signIn(email: string, password: string): Promise<Token> {
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) {
            throw new Error("Invalid email and / or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid email and / or password");
        }

        return this.signToken(user.userId);
    }

    private async signToken(userId: number): Promise<Token> {
        return jwt.sign(
            {
                userId,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" },
        );
    }
}
