import {inject, injectable, named} from "inversify";
import {ReqUser} from "../../entities/req_user";
import {Dashboard} from "../../entities/dashboard";
import {Role} from "../../entities/role";
import {AuthorizationError} from "../../entities/errors/authorization_error";

@injectable()
export class DashboardBuilder {
    constructor() {}
}
