import { inject, injectable, named } from "inversify";
import { Dashboard, SummaryWidget, Widget, WidgetComponentType } from "../../entities/dashboard";
import { DashboardRepository } from "../../repositories/dashboard_repository";

@injectable()
export class DashboardBuilder {
    private dashboard: Promise<Widget>[];

    constructor(
        @inject("Service")
        @named("DashboardRepository")
        private readonly dashboardRepository: DashboardRepository,
    ) {
        this.reset();
    }

    setCasesSummaryWidget(): DashboardBuilder {
        const widget = new Promise<Widget>(async (resolve) => {
            const [totalCases, currentCases, newCasesToday] = await Promise.all([
                this.dashboardRepository.findTotalCases(),
                this.dashboardRepository.findCurrentCases(),
                this.dashboardRepository.findNewCasesToday(new Date()),
            ]);

            const widget = {
                widgetComponentType: WidgetComponentType.SUMMARY,
                title: "COVID-19 Summary",
                summaries: [
                    {
                        description: "Total Cases",
                        value: totalCases,
                        icon: "ArrowUp",
                    },
                    {
                        description: "Current Cases",
                        value: currentCases,
                        icon: "Notes",
                    },
                    {
                        description: "New Cases Today",
                        value: newCasesToday,
                        icon: "NotesPlus",
                    },
                ],
            } as SummaryWidget;

            resolve(widget);
        });

        this.dashboard.push(widget);
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

    async build(): Promise<Dashboard> {
        const dashboard = [...this.dashboard];
        this.reset();
        return Promise.all(dashboard);
    }
}
