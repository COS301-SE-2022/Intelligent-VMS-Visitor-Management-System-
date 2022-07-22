import { useRef, useState } from "react";
import { FiDownload } from "react-icons/fi";

const DownloadChart = ({
    title,
    filename,
    Chart,
    labelvals,
    datavals,
    setStart,
    setRange,
}) => {
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
        <div className="card bg-base-300 p-3 lg:p-5 w-full">
            <h2 className="card-title text-base-content">{title}</h2>
            <div className="h-full">
                <Chart
                    chartRef={chartRef}
                    labelvals={labelvals}
                    datavals={datavals}
                />
            </div>
            <div className="card-actions mt-1 items-center overflow-visible">
                <a
                    ref={downloadLinkRef}
                    onClick={downloadGraph}
                    download={filename}
                    className={`btn btn-primary ${loading && "loading"}`}
                >
                    <FiDownload className="text-xl text-primary-content" />
                </a>

                <div>
                    {setStart && (
                        <input
                            type="date"
                            name="visitDate"
                            placeholder="Visit Date"
                            className="input input-bordered w-full text-base-content"
                            onChange={(e) => {
                                const date = new Date(e.target.value);

                                if (!isNaN(date)) {
                                    setStart(date);
                                }
                            }}
                        />
                    )}
                </div>
                {setRange && (
                    <select
                        onChange={(e) => {
                            const range = e.target.value;
                            setRange(range === "30-day" ? 30 : 7);
                        }}
                        className="select select-primary w-full max-w-xs"
                    >
                        <option selected>30-day</option>
                        <option>7-day</option>
                    </select>
                )}
            </div>
        </div>
    );
};

export default DownloadChart;
