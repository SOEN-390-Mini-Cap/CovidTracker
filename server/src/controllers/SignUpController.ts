import "reflect-metadata";
import * as restify from "restify";
import { Controller, interfaces, Post } from "inversify-restify-utils";
import { injectable } from "inversify";

@Controller("/signup")
@injectable()
export class SignUpController implements interfaces.Controller {
    @Post("/")
    private signUp(req: restify.Request, res: restify.Response): void {
        // Check for JSON
        if (!req.is("application/json")) {
            // indicate error
            res.send(400, "Data is not in json format.");
        }

        res.send(200, "ok");
    }
}
