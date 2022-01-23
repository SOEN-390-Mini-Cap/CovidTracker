import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { AuthenticationRepository } from "../repositories/AuthenticationRepository";

@injectable()
export class AuthenticationService {
    constructor(
        @inject("Repository")
        @named("AuthenticationRepository")
        private readonly _authenticationRepository: AuthenticationRepository,
    ) {}

    async createUser(_body: any) {
        console.log("test1");

        const { email, password }: { email: string; password: string } = _body;
        this._authenticationRepository.createUser(email, password);
    }
}
