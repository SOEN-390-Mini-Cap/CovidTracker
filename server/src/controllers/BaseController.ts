import * as restify from 'restify';
import { Controller, Get, interfaces } from 'inversify-restify-utils';
import { injectable, inject } from 'inversify';

@Controller('/')
@injectable()
export class BaseController implements interfaces.Controller {

    @Get('/')
    private index(req: restify.Request, res: restify.Response): void {
        res.json(200, {
            "status": "ok"
        });
    }
}
