import classnames from "classnames";
import { TrendingUp, FileText, FilePlus, File, Activity } from "react-feather";
import Avatar from "@components/avatar";
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col } from "reactstrap";

export default function SummaryWidget(props) {
    const summaries = props.widget.summaries.map((item, index) => {
        const cols = props.widget.summaries.length === 3 ? { xl: "4", sm: "6" } : { sm: "6" };
        const colMargin = Object.keys(cols);
        const margin = index === 2 ? "sm" : colMargin[0];
        return (
            <Col
                key={index}
                {...cols}
                className={classnames({
                    [`mb-2 mb-${margin}-0`]: index !== props.widget.summaries.length - 1,
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

    const summariesCard = (
        <Card className="card-statistics">
            <CardHeader>
                <CardTitle tag="h4">{props.widget.title}</CardTitle>
            </CardHeader>
            <CardBody className="statistics-body">
                <Row>{summaries}</Row>
            </CardBody>
        </Card>
    );

    return props.widget.summaries.length === 3 ? (
        <Col xl="7" md="6" xs="12">
            {summariesCard}
        </Col>
    ) : (
        <Col xl="5" md="6" xs="12">
            {summariesCard}
        </Col>
    );
}

const iconMap = {
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
    LifeLine: {
        color: "light-primary",
        icon: <Activity size={24} />,
    },
    NotesGreen: {
        color: "light-success",
        icon: <File size={24} />,
    },
};
