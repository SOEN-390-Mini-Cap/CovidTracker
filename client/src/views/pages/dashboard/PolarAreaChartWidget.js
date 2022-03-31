import { Chart as ChartJS, registerables } from "chart.js";
import { PolarArea } from "react-chartjs-2";
import Flatpickr from "react-flatpickr";
import { Calendar, MoreVertical } from "react-feather";
import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    Col,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";

ChartJS.register(...registerables);

export default function PolarAreaChartWidget(props) {
    const labelColor = "#6e6b7b";
    const tooltipShadow = "rgba(0, 0, 0, 0.25)";
    const gridLineColor = "rgba(200, 200, 200, 0.2)";
    const lineChartPrimary = "#666ee8";
    const lineChartDanger = "#ff4961";
    const warningColorShade = "#ffbd1f";
    const warningLightColor = "#FDAC34";
    const successColorShade = "#28dac6";
    const primaryColorShade = "#836AF9";
    const infoColorShade = "#299AFF";
    const yellowColor = "#ffe800";
    const greyColor = "#4F5D70";
    const blueColor = "#2c9aff";
    const blueLightColor = "#84D0FF";
    const greyLightColor = "#EDF1F4";
    const primary = "#666ee8";

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500 },
        layout: {
            padding: {
                top: -5,
                bottom: -45,
            },
        },
        scales: {
            r: {
                grid: { display: false },
                ticks: { display: false },
            },
        },
        plugins: {
            legend: {
                position: "right",
                align: "start",
                labels: {
                    padding: 15,
                    boxWidth: 9,
                    color: labelColor,
                    usePointStyle: true,
                },
            },
        },
    };

    const data = {
        labels: props.widget.labels,
        datasets: [
            {
                borderWidth: 0,
                label: props.widget.dataset[0].label,
                data: props.widget.dataset[0].data,
                backgroundColor: [
                    primary,
                    yellowColor,
                    warningColorShade,
                    infoColorShade,
                    greyColor,
                    successColorShade,
                ],
            },
        ],
    };

    return (
        <Col xl="5" md="6" xs="12">
            <Card>
                <CardHeader className="d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column">
                    <CardTitle tag="h4">{props.widget.title}</CardTitle>
                </CardHeader>
                <CardBody>
                    <div style={{ height: "300px" }}>
                        <PolarArea data={data} options={options} height={300} />
                    </div>
                </CardBody>
            </Card>
        </Col>
    );
}
