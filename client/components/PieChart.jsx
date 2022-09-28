import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ chartRef, labelvals, datavals, datalabels }) => {
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

        const data = {
        labels: labelvals,
        datasets: [
            {
                label: datalabels[0],
                data: datavals,
                backgroundColor: [
                    `hsl(${colours[0]})`,
                    `hsl(${colours[1]})`,
                    `hsl(${colours[2]})`,
                ],
                borderColor: [
                    `hsl(${coloursBorders[0]})`,
                    `hsl(${coloursBorders[1]})`,
                    `hsl(${coloursBorders[2]})`,
                ],
                borderWidth: 1,
            },
        ],
    };

        return <Pie ref={chartRef} data={data} />;
    } else {
        return <></>;
    }


};

export default PieChart;
