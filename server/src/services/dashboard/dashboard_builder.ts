import { inject, injectable, named } from "inversify";
import { ChartWidget, Dashboard, SummaryWidget, Widget, WidgetComponentType } from "../../entities/dashboard";
import { DashboardRepository } from "../../repositories/dashboard_repository";

@injectable()
export class DashboardBuilder {
    private dashboard: Promise<Widget>[];

    constructor(
        @inject("Repository")
        @named("DashboardRepository")
        private readonly dashboardRepository: DashboardRepository,
    ) {
        this.reset();
    }

    setCasesSummaryWidget(): DashboardBuilder {
        const widget = new Promise<Widget>(async (resolve) => {
            const [totalCases, currentCases, newCasesToday] = await Promise.all([
                this.dashboardRepository.findTotalCasesToDate(new Date()),
                this.dashboardRepository.findCurrentCases(),
                this.dashboardRepository.findNewCaseByDate(new Date()),
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

    setDoctorPatientSummaryWidget(doctorId: number): DashboardBuilder {
        const widget = new Promise<Widget>(async (resolve) => {
            const [patientCount, newPatientCount] = await Promise.all([
                this.dashboardRepository.findPatientCountByDoctor(doctorId),
                this.dashboardRepository.findNewPatientCountByDoctor(doctorId),
            ]);

            const widget = {
                widgetComponentType: WidgetComponentType.SUMMARY,
                title: "Patient Summary",
                summaries: [
                    {
                        description: "Total Patients",
                        value: patientCount,
                        icon: "Heart",
                    },
                    {
                        description: "New Patients Today",
                        value: newPatientCount,
                        icon: "NotesPlus",
                    },
                ],
            } as SummaryWidget;

            resolve(widget);
        });

        this.dashboard.push(widget);
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

    setDoctorTasksSummaryWidget(doctorId: number): DashboardBuilder {
        const widget = new Promise<Widget>(async (resolve) => {
            const [appointmentCount, unreadStatusReportCount] = await Promise.all([
                this.dashboardRepository.findAppointmentCountByDoctor(doctorId),
                this.dashboardRepository.findUnreadStatusReportCountByDoctor(doctorId),
            ]);

            const widget = {
                widgetComponentType: WidgetComponentType.SUMMARY,
                title: "Today's Tasks",
                summaries: [
                    {
                        description: "Appointments",
                        value: appointmentCount,
                        icon: "LifeLine",
                    },
                    {
                        description: "Unread Status Reports",
                        value: unreadStatusReportCount,
                        icon: "NotesPurple",
                    },
                ],
            } as SummaryWidget;

            resolve(widget);
        });

        this.dashboard.push(widget);
        return this;
    }

    setPatientTasksSummaryWidget(): DashboardBuilder {
        this.dashboard.push(null);
        return this;
    }

    setCasesChartWidget(): DashboardBuilder {
        const widget = new Promise<Widget>(async (resolve) => {
            const dates = [...Array(7)].map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                return d;
            });

            const totalCases = await Promise.all(dates.map((d) => this.dashboardRepository.findTotalCasesToDate(d)));
            const newCases = await Promise.all(dates.map((d) => this.dashboardRepository.findNewCaseByDate(d)));

            const widget = {
                widgetComponentType: WidgetComponentType.AREA_CHART,
                title: "COVID-19 Cases",
                labels: dates.map((d) => d.toISOString()),
                dataset: [
                    {
                        label: "Total",
                        data: totalCases,
                    },
                    {
                        label: "New",
                        data: newCases,
                    },
                ],
            } as ChartWidget;

            resolve(widget);
        });

        this.dashboard.push(widget);
        return this;
    }

    setCasesByAgeChartWidget(): DashboardBuilder {
        const widget = new Promise<Widget>(async (resolve) => {
            const ageRanges = [
                [0, 10],
                [11, 20],
                [21, 30],
                [31, 40],
                [41, 50],
                [51, 60],
                [61, 70],
                [71, 80],
                [81, 90],
                [91, 999],
            ];

            const casesByAgeRange = await Promise.all(
                ageRanges.map(([minAge, maxAge]) => this.dashboardRepository.findCasesByAgeRange(minAge, maxAge)),
            );

            const widget = {
                widgetComponentType: WidgetComponentType.POLAR_AREA_CHART,
                title: "COVID-19 Cases by Age",
                labels: ageRanges.map(([minAge, maxAge]) => `${minAge}-${maxAge}`),
                dataset: [
                    {
                        label: "Cases",
                        data: casesByAgeRange,
                    },
                ],
            } as ChartWidget;

            resolve(widget);
        });

        this.dashboard.push(widget);
        return this;
    }

    setSymptomsChartWidget(): DashboardBuilder {
        const widget = new Promise<Widget>(async (resolve) => {
            const dates = [...Array(7)].map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                return d;
            });

            // Stack 0
            const feverCountsByDate = await Promise.all(
                dates.map((d) => this.dashboardRepository.findSymptomCountByDate("fever", d)),
            );
            const coughCountsByDate = await Promise.all(
                dates.map((d) => this.dashboardRepository.findSymptomCountByDate("cough", d)),
            );
            const shortnessOfBreathCountsByDate = await Promise.all(
                dates.map((d) => this.dashboardRepository.findSymptomCountByDate("shortnessOfBreath", d)),
            );
            const lossOfTasteAndSmellCountsByDate = await Promise.all(
                dates.map((d) => this.dashboardRepository.findSymptomCountByDate("lossOfTasteAndSmell", d)),
            );

            // Stack 1
            const nauseaCountsByDate = await Promise.all(
                dates.map((d) => this.dashboardRepository.findSymptomCountByDate("nausea", d)),
            );
            const stomachAchesCountsByDate = await Promise.all(
                dates.map((d) => this.dashboardRepository.findSymptomCountByDate("stomachAches", d)),
            );
            const vomitingCountsByDate = await Promise.all(
                dates.map((d) => this.dashboardRepository.findSymptomCountByDate("vomiting", d)),
            );
            const headacheCountsByDate = await Promise.all(
                dates.map((d) => this.dashboardRepository.findSymptomCountByDate("headache", d)),
            );
            const musclePainCountsByDate = await Promise.all(
                dates.map((d) => this.dashboardRepository.findSymptomCountByDate("musclePain", d)),
            );
            const soreThroatCountsByDate = await Promise.all(
                dates.map((d) => this.dashboardRepository.findSymptomCountByDate("soreThroat", d)),
            );

            const widget = {
                widgetComponentType: WidgetComponentType.BAR_CHART,
                title: "Primary & Secondary Symptoms",
                labels: dates.map((d) => d.toISOString()),
                dataset: [
                    {
                        label: "Fever",
                        data: feverCountsByDate,
                        stack: "Stack 0",
                    },
                    {
                        label: "Cough",
                        data: coughCountsByDate,
                        stack: "Stack 0",
                    },
                    {
                        label: "Shortness of Breath",
                        data: shortnessOfBreathCountsByDate,
                        stack: "Stack 0",
                    },
                    {
                        label: "Loss of Taste and Smell",
                        data: lossOfTasteAndSmellCountsByDate,
                        stack: "Stack 0",
                    },
                    {
                        label: "Nausea",
                        data: nauseaCountsByDate,
                        stack: "Stack 1",
                    },
                    {
                        label: "Stomach Aches",
                        data: stomachAchesCountsByDate,
                        stack: "Stack 1",
                    },
                    {
                        label: "Vomiting",
                        data: vomitingCountsByDate,
                        stack: "Stack 1",
                    },
                    {
                        label: "Headache",
                        data: headacheCountsByDate,
                        stack: "Stack 1",
                    },
                    {
                        label: "Muscle Pain",
                        data: musclePainCountsByDate,
                        stack: "Stack 1",
                    },
                    {
                        label: "Sore Throat",
                        data: soreThroatCountsByDate,
                        stack: "Stack 1",
                    },
                ],
            } as ChartWidget;

            resolve(widget);
        });

        this.dashboard.push(widget);
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
