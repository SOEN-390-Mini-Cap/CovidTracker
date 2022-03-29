import { injectable } from "inversify";
import { Dashboard } from "../../entities/dashboard";

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

    setAdminPatientSummaryWidget(): DashboardBuilder {
        this.dashboard.push(null);
        return this;
    }

    setDoctorPatientSummaryWidget(): DashboardBuilder {
        this.dashboard.push(null);
        return this;
    }

    setHealthOfficialPatientSummaryWidget(): DashboardBuilder {
        this.dashboard.push(null);
        return this;
    }

    setImmigrationOfficerPatientSummaryWidget(): DashboardBuilder {
        this.dashboard.push(null);
        return this;
    }

    setDoctorTasksSummaryWidget(): DashboardBuilder {
        this.dashboard.push(null);
        return this;
    }

    setPatientTasksSummaryWidget(): DashboardBuilder {
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

    setSymptomsChartWidget(): DashboardBuilder {
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
