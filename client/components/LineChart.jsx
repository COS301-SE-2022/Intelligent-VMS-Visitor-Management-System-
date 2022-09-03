import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Filler,
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
    Filler,
    Tooltip,
    Legend
);

const LineChart = ({ chartRef, labelvals, datavals, datalabels }) => {
    const options = {
        responsive: true,
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            legend: {
                position: "top",
            },
        },
    };

    if (typeof window !== "undefined") {
        const style = window.getComputedStyle(document.body);
        const primary = style.getPropertyValue("--p");
        const primaryContent = style.getPropertyValue("--pf");
        const secondary = style.getPropertyValue("--s");
        const secondaryContent = style.getPropertyValue("--sf");
        const tertiary = style.getPropertyValue("--a");
        const tertiaryContent = style.getPropertyValue("--af");

        const colours = [primary, secondary, tertiary];
        const coloursBorders = [primaryContent, secondaryContent, tertiaryContent];

        const labels = labelvals;

        const datasets = datavals.map((dataSet, idx) => {
            return {
                label: `${datalabels ? datalabels[idx] : "Data Set " + (idx + 1)}`,
                lineTension: 0.5,
                data: dataSet,
                borderColor: `hsl(${colours[idx]})`,
                backgroundColor: `hsl(${
                    coloursBorders[idx % coloursBorders.length]
                })`,
                borderWidth: 2,
            };
        });

        const data = {
            labels,
            datasets: datasets,
        };

        return <Line ref={chartRef} options={options} data={data} />;
    } else {
        return <></>;
    }
};

export default LineChart;
