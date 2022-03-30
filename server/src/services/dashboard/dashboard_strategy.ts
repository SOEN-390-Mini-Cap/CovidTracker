import { inject, injectable, named } from "inversify";
import { ReqUser } from "../../entities/req_user";
import { Dashboard } from "../../entities/dashboard";
import { Role } from "../../entities/role";
import { AuthorizationError } from "../../entities/errors/authorization_error";
import { DashboardBuilder } from "./dashboard_builder";

@injectable()
export class DashboardStrategy {
    constructor(
        @inject("Service")
        @named("DashboardBuilder")
        private readonly dashboardBuilder: DashboardBuilder,
    ) {}

    dashboardStrategyFactory(reqUser: ReqUser): () => Promise<Dashboard> {
        if (reqUser.role === Role.USER) {
            return this.userDashboardStrategy;
        }
        if (reqUser.role === Role.PATIENT) {
            return this.patientDashboardStrategy;
        }
        if (reqUser.role === Role.DOCTOR) {
            return this.doctorDashboardStrategy.bind(this.doctorDashboardStrategy, reqUser);
        }
        if (reqUser.role === Role.ADMIN) {
            return this.adminDashboardStrategy;
        }
        if (reqUser.role === Role.HEALTH_OFFICIAL) {
            return this.healthOfficialDashboardStrategy;
        }
        if (reqUser.role === Role.IMMIGRATION_OFFICER) {
            return this.immigrationOfficerDashboardStrategy;
        }

        throw new AuthorizationError();
    }

    private async userDashboardStrategy(): Promise<Dashboard> {
        return this.dashboardBuilder //
            .setCasesSummaryWidget()
            .setCasesChartWidget()
            .setCasesByAgeChartWidget()
            .build();
    }

    private async patientDashboardStrategy(): Promise<Dashboard> {
        return this.dashboardBuilder
            .setCasesSummaryWidget()
            .setPatientTasksSummaryWidget()
            .setCasesChartWidget()
            .setCasesByAgeChartWidget()
            .build();
    }

    private async doctorDashboardStrategy(reqUser: ReqUser): Promise<Dashboard> {
        return this.dashboardBuilder
            .setCasesSummaryWidget()
            .setDoctorPatientSummaryWidget(reqUser.userId)
            .setDoctorTasksSummaryWidget()
            .setCasesChartWidget()
            .setCasesByAgeChartWidget()
            .setSymptomsChartWidget()
            .build();
    }

    private async adminDashboardStrategy(): Promise<Dashboard> {
        return this.dashboardBuilder
            .setCasesSummaryWidget()
            .setAdminPatientSummaryWidget()
            .setCasesChartWidget()
            .setCasesByAgeChartWidget()
            .build();
    }

    private async healthOfficialDashboardStrategy(): Promise<Dashboard> {
        return this.dashboardBuilder
            .setCasesSummaryWidget()
            .setHealthOfficialPatientSummaryWidget()
            .setCasesChartWidget()
            .setCasesByAgeChartWidget()
            .setSymptomsChartWidget()
            .build();
    }

    private async immigrationOfficerDashboardStrategy(): Promise<Dashboard> {
        return this.dashboardBuilder //
            .setCasesSummaryWidget()
            .setCasesChartWidget()
            .setCasesByAgeChartWidget()
            .build();
    }
}
