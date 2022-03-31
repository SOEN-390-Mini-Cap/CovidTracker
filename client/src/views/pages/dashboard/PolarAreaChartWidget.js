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
                    color: "#6e6b7b",
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
                    "#B7F153",
                    "#FFE802",
                    "#EC7FD3",
                    "#00CFE8",
                    "#28DAC6",
                    "#6610F2",
                    "#259EF0",
                    "#FF9F43",
                    "#28C76F",
                    "#D63384",
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
