import { useRef, useState } from "react";
import { FiDownload } from "react-icons/fi";

const DownloadChart = ({
    title,
    filename,
    Chart,
    labelvals,
    datavals,
    setStart,
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
        <div className="card bg-base-300 p-5">
            <h2 className="card-title">{title}</h2>
            <Chart
                chartRef={chartRef}
                labelvals={labelvals}
                datavals={datavals}
            />
            <div className="card-actions mt-3">
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

                            if (!isNaN(date)) {
                                setStart(date);
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default DownloadChart;
