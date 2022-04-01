import { Chart as ChartJS, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card, CardHeader, CardTitle, CardBody, Col } from "reactstrap";

ChartJS.register(...registerables);

export default function BarChartWidget(props) {
    const labelColor = "#6e6b7b";
    const gridLineColor = "rgba(200, 200, 200, 0.2)";

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500 },
        scales: {
            x: {
                grid: {
                    color: gridLineColor,
                    borderColor: gridLineColor,
                },
                ticks: { color: labelColor },
            },
            y: {
                min: 0,
                max: 35,
                grid: {
                    color: gridLineColor,
                    borderColor: gridLineColor,
                },
            },
        },
    };

    const barChartColors = [
        "#259EF0",
        "#6AC6F9",
        "#9AE7FF",
        "#D9F1FF",
        "#6610F2",
        "#826AF9",
        "#AB9AFF",
        "#EAB0FF",
        "#F3C5FF",
        "#FFD9FB",
    ];

    const data = {
        labels: props.widget.labels.map((l) => l.substring(5, 10)).reverse(),
        datasets: props.widget.dataset.map((dataset, i) => ({
            label: dataset.label,
            backgroundColor: barChartColors[i],
            borderColor: "transparent",
            maxBarThickness: 20,
            borderRadius: i === props.widget.dataset.length - 1 || i === 3 ? { topRight: 15, topLeft: 15 } : {},
            data: dataset.data,
            stack: dataset.stack,
        })),
    };

    return (
        <Col xl="8" xs="12">
            <Card>
                <CardHeader className="d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column">
                    <CardTitle tag="h4">{props.widget.title}</CardTitle>
                </CardHeader>
                <CardBody>
                    <div style={{ height: "450px" }}>
                        <Bar data={data} options={options} height={450} />
                    </div>
                </CardBody>
            </Card>
        </Col>
    );
}
