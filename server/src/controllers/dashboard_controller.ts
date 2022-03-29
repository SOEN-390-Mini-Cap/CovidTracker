import "reflect-metadata";
import { Controller, Get, interfaces } from "inversify-restify-utils";
import { inject, injectable, named } from "inversify";
import { Request, Response } from "restify";
import {DashboardStrategy} from "../services/dashboard/dashboard_strategy";

@Controller("/dashboards")
@injectable()
export class DashboardController implements interfaces.Controller {
    constructor(
        @inject("Service")
        @named("DashboardService")
        private readonly dashboardService: DashboardStrategy,
    ) {}

    @Get("/", "injectAuthDataMiddleware")
    private async getDashboards(req: Request, res: Response): Promise<void> {
        try {
            const dashboard = await this.dashboardService.dashboardStrategyFactory(req["token"])();

            res.json(200, dashboard);
        } catch (error) {
            res.json(error.statusCode || 500, { error: error.message });
        }
    }
}
