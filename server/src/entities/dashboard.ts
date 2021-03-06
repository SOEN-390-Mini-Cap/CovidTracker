export type Dashboard = Widget[];

export interface Widget {
    widgetComponentType: WidgetComponentType;
    title: string;
}

export enum WidgetComponentType {
    AREA_CHART = "AREA_CHART",
    BAR_CHART = "BAR_CHART",
    POLAR_AREA_CHART = "POLAR_AREA_CHART",
    SUMMARY = "SUMMARY",
}

export interface ChartWidget extends Widget {
    labels: Label[];
    dataset: Dataset;
}

type Label = string;
interface Datapoint {
    label: Label;
    data: number[];
    stack?: string;
}
type Dataset = Datapoint[];

export interface SummaryWidget extends Widget {
    summaries: Summary[];
}

interface Summary {
    description: string;
    value: number;
    icon: string;
}
