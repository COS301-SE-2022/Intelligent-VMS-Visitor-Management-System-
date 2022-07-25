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

const LineChart = ({ chartRef, labelvals, datavals, datalabels }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
        },
    };

    const colours = ["white","gray"];

    const labels = labelvals;

    const datasets = datavals.map((dataSet,idx) => {
        return {
            label: `${datalabels ? datalabels[idx] : "Data Set " + (idx+1)}`,
            lineTension: 0.2,
            data: dataSet,
            borderColor: colours[idx],
            backgroundColor: colours[idx],
            borderWidth: 2,
        };
    });

    const data = {
        labels,
        datasets: datasets,
    };

    return <Line ref={chartRef} options={options} data={data} />;
};

export default LineChart;
