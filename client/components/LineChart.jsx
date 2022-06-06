import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LineChart = ({ chartRef, labelvals, datavals }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
        },
    };

    const labels = labelvals;

    const data = {
        labels,
        datasets: [
            {
                label: "Data",
                lineTension: 0.2,
                data: datavals,
                borderColor: "white",
                backgroundColor: "white",
                borderWidth: 2,
            },
        ],
    };

    return <Line ref={chartRef} options={options} data={data} />;
};

export default LineChart;
