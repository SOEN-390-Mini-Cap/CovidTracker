import "reflect-metadata";
import { injectable } from "inversify";

@injectable()
export class AuthenticationRepository {
    async createUser(username: string, password: string) {
        console.log(username + " : " + password);
        return true;
    }
}
