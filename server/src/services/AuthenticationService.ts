import "reflect-metadata";
import { injectable } from "inversify";
import { AuthenticationRepository } from "../repositories/AuthenticationRepository";

@injectable()
export class AuthenticationService {
    private readonly _authenticationRepository: AuthenticationRepository;

    constructor(_authRepo: AuthenticationRepository) {
        this._authenticationRepository = _authRepo;
    }

    async createUser(_body: any) {
        console.log("test1");

        const { username, password }: { username: string; password: string } = _body;
        this._authenticationRepository.createUser(username, password);
    }
}
