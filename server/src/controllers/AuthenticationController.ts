import "reflect-metadata";
import * as restify from "restify";
import { Controller, interfaces, Post } from "inversify-restify-utils";
import { injectable } from "inversify";

@Controller("/")
@injectable()
export class AuthenticationController implements interfaces.Controller {
    @Post("/signup")
    private signUp(req: restify.Request, res: restify.Response): void {
        // Check for JSON
        if (!req.is("application/json")) {
            // indicate error
            res.send(400, "Data is not in json format.");
            return;
        }
        res.send(200, req.body.name);
    }
}
