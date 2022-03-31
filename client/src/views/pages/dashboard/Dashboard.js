import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getDashboard, getTest, getUser } from "../../../services/api";
import { Col, Row } from "reactstrap";
import SummaryWidget from "./SummaryWidget";
import {FilePlus, FileText, TrendingUp} from "react-feather";
import AreaChartWidget from "./AreaChartWidget";

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

    console.log(dashboard);

    const summaryWidgets = dashboard?.filter((widget) => widget.widgetComponentType === "SUMMARY");
    const areaChartWidget = dashboard?.find((widget) => widget.widgetComponentType === "AREA_CHART");

    return (
        <div>
            <Row className="match-height">
                {summaryWidgets?.map((widget, index) => (
                    <SummaryWidget key={index} widget={widget} />
                ))}
            </Row>
            <Row className="match-height">
                {areaChartWidget && (<AreaChartWidget widget={areaChartWidget} />)}
            </Row>
        </div>
    );
}
