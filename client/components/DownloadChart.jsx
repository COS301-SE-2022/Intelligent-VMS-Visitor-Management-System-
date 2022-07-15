import { useRef, useState } from "react";
import { FiDownload } from "react-icons/fi";

const DownloadChart = ({ title, filename, Chart, labelvals, datavals, setStart, setRange }) => {
    const chartRef = useRef(null);
    const downloadLinkRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const downloadGraph = () => {
        setLoading(true);
        if (chartRef.current) {
            downloadLinkRef.current.href = chartRef.current.toBase64Image();
        }
        setLoading(false);
    };

    return (
        <div className="card bg-base-300 p-5">
            <h2 className="card-title">{title}</h2>
            <Chart
                chartRef={chartRef}
                labelvals={labelvals}
                datavals={datavals}
            />
            <div className="card-actions mt-3 items-center overflow-visible">
                <a
                    ref={downloadLinkRef}
                    onClick={downloadGraph}
                    download={filename}
                    className={`btn btn-primary ${loading && "loading"}`}
                >
                    <FiDownload className="text-xl text-primary-content" />
                </a>
                
                <div>
                <input
                    type="date"
                    name="visitDate"
                    placeholder="Visit Date"
                    className="input input-bordered w-full"
                    onChange={(e) => {
                        const date = new Date(e.target.value);

                        if(!isNaN(date)) {
                            setStart(date);
                        }
                    }}
                />
                </div>
                {
                    setRange && 
                <select onChange={(e) => {
                    const range = e.target.value;
                    setRange(range === "Monthly" ? 30 : 7);
                }}className="select w-full max-w-xs">
                      <option disabled selected>Select Timerange</option>
                      <option>Monthly</option>
                      <option>Weekly</option>
                </select>
                }
                </div>
        </div>
    );
};

export default DownloadChart;
