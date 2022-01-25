import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { UserRepository } from "../repositories/user_repository";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Token } from "../entities/token";
import { AddressRepository } from "../repositories/address_repository";
import { AddressReqData, UserReqData } from "../controllers/authentication_controller";

@injectable()
export class AuthenticationService {
    constructor(
        @inject("Repository")
        @named("UserRepository")
        private readonly userRepository: UserRepository,
        @inject("Repository")
        @named("AddressRepository")
        private readonly addressRepository: AddressRepository,
    ) {}

    async createUser(userData: UserReqData, addressData: AddressReqData): Promise<Token> {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const userId = await this.userRepository.createUser({
            ...userData,
            password: hashedPassword,
        });

        await this.addressRepository.createAddress(userId, addressData);

        return this.generateToken(userId);
    }

    async createSession(email: string, password: string): Promise<Token> {
        const user = await this.userRepository.getUserByEmail(email);
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
