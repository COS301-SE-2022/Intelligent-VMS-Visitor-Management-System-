import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const HorizontalChart = ({ chartRef, labelvals, datavals, datalabels }) => {
    const options = {
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };
    const style = getComputedStyle(document.body);
    const primary = style.getPropertyValue("--p");
    const primaryContent = style.getPropertyValue("--pf");
    const secondary = style.getPropertyValue("--s");
    const secondaryContent = style.getPropertyValue("--sf");
    const tertiary = style.getPropertyValue("--a");
    const tertiaryContent = style.getPropertyValue("--af");

    const colours = [primary, secondary, tertiary];
    const coloursBorders = [primaryContent, secondaryContent, tertiaryContent];

    console.log("Vals:");
    console.log(datavals);
    const datasets = datavals.map((dataSet, idx) => {
        return {
            label: datalabels[idx],
            data: dataSet,
            borderColor: `hsl(${colours[idx]})`,
            backgroundColor: `hsl(${
                coloursBorders[idx % coloursBorders.length]
            })`,
            borderWidth: 2,
        };
    });

    const data = {
        labels: labelvals,
        datasets: datasets,
    };

    return <Bar options={options} data={data} />;
};

export default HorizontalChart;
