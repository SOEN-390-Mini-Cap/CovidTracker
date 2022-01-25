import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { AuthenticationRepository } from "../repositories/authentication_repository";
import * as bcrypt from "bcrypt";
import { User } from "../entities/user";

@injectable()
export class AuthenticationService {
    constructor(
        @inject("Repository")
        @named("AuthenticationRepository")
        private readonly _authenticationRepository: AuthenticationRepository,
    ) {}

    async createUser(_body: any) {
        const { email, password, first_name, last_name, date_of_birth }: User = _body;
        const salt: string = bcrypt.genSaltSync(8);
        const hash: string = await bcrypt.hash(password, salt);
        return this._authenticationRepository.createUser(email, hash, first_name, last_name, date_of_birth);
    }
}
