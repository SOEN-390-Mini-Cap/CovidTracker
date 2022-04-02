import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getDashboard } from "../../../services/api";
import { Row } from "reactstrap";
import SummaryWidget from "./SummaryWidget";
import AreaChartWidget from "./AreaChartWidget";
import PolarAreaChartWidget from "./PolarAreaChartWidget";
import BarChartWidget from "./BarChartWidget";

const selectToken = (state) => state.auth.userData.token;

export default function Dashboard() {
    const token = useSelector(selectToken);

    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {
        async function f() {
            setDashboard(await getDashboard(token));
        }
        f();
    }, [token]);

    const summaryWidgets = dashboard?.filter((widget) => widget.widgetComponentType === "SUMMARY");
    const areaChartWidget = dashboard?.find((widget) => widget.widgetComponentType === "AREA_CHART");
    const polarAreaChartWidget = dashboard?.find((widget) => widget.widgetComponentType === "POLAR_AREA_CHART");
    const barChartWidget = dashboard?.find((widget) => widget.widgetComponentType === "BAR_CHART");

    return (
        <div>
            <Row className="match-height">
                {summaryWidgets?.map((widget, index) => (
                    <SummaryWidget key={index} widget={widget} />
                ))}
            </Row>
            <Row className="match-height">
                {areaChartWidget && <AreaChartWidget widget={areaChartWidget} />}
                {polarAreaChartWidget && <PolarAreaChartWidget widget={polarAreaChartWidget} />}
            </Row>
            <Row className="match-height">{barChartWidget && <BarChartWidget widget={barChartWidget} />}</Row>
        </div>
    );
}
