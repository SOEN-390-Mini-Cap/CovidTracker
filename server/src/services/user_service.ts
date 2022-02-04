import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { UserRepository } from "../repositories/user_repository";
import { User } from "../entities/user";

@injectable()
export class UserService {
    constructor(
        @inject("Repository")
        @named("UserRepository")
        private readonly userRepository: UserRepository,
    ) {}

    async findUserByUserId(userId: number): Promise<User> {
        const user = await this.userRepository.findUserByUserId(userId);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }
}
