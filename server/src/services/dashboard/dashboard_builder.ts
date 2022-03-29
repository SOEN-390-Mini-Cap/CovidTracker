import {inject, injectable, named} from "inversify";
import {ReqUser} from "../../entities/req_user";
import {Dashboard} from "../../entities/dashboard";
import {Role} from "../../entities/role";
import {AuthorizationError} from "../../entities/errors/authorization_error";

@injectable()
export class DashboardBuilder {
    private dashboard: Dashboard;

    constructor() {
        this.reset();
    }

    setCasesSummaryWidget(): DashboardBuilder {
        this.dashboard.push(null);
        return this;
    }

    setCasesChartWidget(): DashboardBuilder {
        this.dashboard.push(null);
        return this;
    }

    setCasesByAgeChartWidget(): DashboardBuilder {
        this.dashboard.push(null);
        return this;
    }

    private reset(): void {
        this.dashboard = [];
    }

    build(): Dashboard {
        const dashboard = [...this.dashboard];
        this.reset();
        return dashboard;
    }
}
