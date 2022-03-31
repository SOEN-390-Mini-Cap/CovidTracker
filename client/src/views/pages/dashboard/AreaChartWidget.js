import { Chart as ChartJS, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import Flatpickr from "react-flatpickr";
import { Calendar } from "react-feather";
import { Card, CardHeader, CardTitle, CardBody, Col } from "reactstrap";

ChartJS.register(...registerables);

export default function AreaChartWidget(props) {
    const labelColor = "#6e6b7b";
    const blueColor = "#2c9aff";
    const blueLightColor = "#84D0FF";

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: { top: -20 },
        },
        hover: {
            mode: "nearest",
            intersect: false,
        },
        scales: {
            x: {
                ticks: { color: labelColor },
            },
            y: {
                min: 0,
                max: 200,
                ticks: {
                    stepSize: 100,
                    color: labelColor,
                },
            },
        },
        plugins: {
            legend: {
                align: "start",
                position: "top",
                labels: {
                    padding: 30,
                    boxWidth: 9,
                    color: labelColor,
                    usePointStyle: true,
                },
            },
            tooltip: {
                mode: "index",
                intersect: false,
            },
        },
    };

    const data = {
        labels: props.widget.labels.map((l) => l.substring(5, 10)).reverse(),
        datasets: [
            {
                fill: true,
                tension: 0,
                label: props.widget.dataset[1].label,
                pointRadius: 0.5,
                pointHoverRadius: 5,
                pointStyle: "circle",
                pointHoverBorderWidth: 5,
                borderColor: "transparent",
                pointHoverBorderColor: "#fff",
                pointBorderColor: "transparent",
                backgroundColor: blueLightColor,
                pointHoverBackgroundColor: blueLightColor,
                data: props.widget.dataset[1].data,
            },
            {
                fill: true,
                tension: 0,
                label: props.widget.dataset[0].label,
                pointRadius: 0.5,
                pointHoverRadius: 5,
                pointStyle: "circle",
                backgroundColor: blueColor,
                pointHoverBorderWidth: 5,
                borderColor: "transparent",
                pointHoverBorderColor: "#fff",
                pointBorderColor: "transparent",
                pointHoverBackgroundColor: blueColor,
                data: props.widget.dataset[0].data,
            },
        ],
    };

    return (
        <Col xl="7" md="6" xs="12">
            <Card>
                <CardHeader className="d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column">
                    <CardTitle tag="h4">{props.widget.title}</CardTitle>
                </CardHeader>
                <CardBody>
                    <div style={{ height: "300px" }}>
                        <Line data={data} options={options} height={300} />
                    </div>
                </CardBody>
            </Card>
        </Col>
    );
}
