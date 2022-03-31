import classnames from "classnames";
import { TrendingUp, User, Box } from "react-feather";
import Avatar from "@components/avatar";
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col } from "reactstrap";
import {iconMap} from "./Dashboard";

export default function CasesSummaryWidget(props) {
    const data = [
        {
            title: "230k",
            subtitle: "Sales",
            color: "light-primary",
            icon: <TrendingUp size={24} />,
        },
        {
            title: "8.549k",
            subtitle: "Customers",
            color: "light-info",
            icon: <User size={24} />,
        },
        {
            title: "1.423k",
            subtitle: "Products",
            color: "light-danger",
            icon: <Box size={24} />,
        },
    ];

    const summaries = props.widget.summaries.map((item, index) => {
        const cols = { xl: "4", sm: "6" };
        const colMargin = Object.keys(cols);
        const margin = index === 2 ? "sm" : colMargin[0];
        return (
            <Col
                key={index}
                {...cols}
                className={classnames({
                    [`mb-2 mb-${margin}-0`]: index !== data.length - 1,
                })}
            >
                <div className="d-flex align-items-center">
                    <Avatar color={iconMap[item.icon].color} icon={iconMap[item.icon].icon} className="me-2" />
                    <div className="my-auto">
                        <h4 className="fw-bolder mb-0">{item.value}</h4>
                        <CardText className="font-small-3 mb-0">{item.description}</CardText>
                    </div>
                </div>
            </Col>
        );
    });

    return (
        <Card className="card-statistics">
            <CardHeader>
                <CardTitle tag="h4">{props.widget.title}</CardTitle>
            </CardHeader>
            <CardBody className="statistics-body">
                <Row>{summaries}</Row>
            </CardBody>
        </Card>
    );
}
