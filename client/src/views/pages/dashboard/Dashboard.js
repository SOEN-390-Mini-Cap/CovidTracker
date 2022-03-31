import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getDashboard, getTest, getUser } from "../../../services/api";
import { Col, Row } from "reactstrap";
import CasesSummaryWidget from "./CasesSummaryWidget";
import {FilePlus, FileText, TrendingUp} from "react-feather";

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

    return dashboard && (
        <Row className="match-height">
            <Col xl="7" md="6" xs="12">
                <CasesSummaryWidget widget={dashboard[0]} />
            </Col>
            {/*<Col xl="5" md="6" xs="12">*/}
            {/*    <CasesSummaryWidget />*/}
            {/*</Col>*/}
        </Row>
    );
}

export const iconMap = {
    ArrowUp: {
        color: "light-danger",
        icon: <TrendingUp size={24} />,
    },
    Notes: {
        color: "light-primary",
        icon: <FileText size={24} />,
    },
    NotesPlus: {
        color: "light-success",
        icon: <FilePlus size={24} />,
    },
};
