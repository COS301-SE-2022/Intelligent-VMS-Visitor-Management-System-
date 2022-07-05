import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaSearch } from "react-icons/fa";

import { Line } from "react-chartjs-2";

const AnalyticsReport = ({ data, name, total, startDate, endDate }) => {
    const inputRef = useRef(null);

    const printDocument = () => {
        html2canvas(inputRef.current).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF();
            pdf.addImage(imgData, "JPEG", 0, 0);
            pdf.save("download.pdf");
        });
    };

    // width: '210mm', minHeight: '297mm', marginLeft: 'auto', marginRight: 'auto'

    return (
        <div className="flex-col">
            <div
                className="bg-base-300"
                ref={inputRef}
                style={{
                    width: "210mm",
                    minHeight: "297mm",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            >
                <div className="mt-3 mb-3">
                    <div className="bg-primary text-primary-content">
                        <h1 className="px-3 py-3 text-base font-bold">
                            User Report For{" "}
                            <span className="capitalize text-secondary">
                                {name}
                            </span>
                        </h1>
                    </div>
                </div>
                <div className="px-3 text-primary-content">
                    <h2 className="text-base font-bold">
                        Total Number Of Invites
                    </h2>
                    <p className="text-xl font-bold text-primary">{total}</p>
                    <div className="divider"></div>
                    <h2 className="text-base font-bold">Visitation Dates</h2>
                    <div className="flex-col">
                        {!data || data.length === 0 ? (
                            <div>Nothing to show...</div>
                        ) : (
                            data.map((val, idx) => {
                                return (
                                    <div className="block" key={idx}>
                                        <p className="text-sm">
                                            {idx + 1}. {val.inviteDate}:{" "}
                                            {val.userEmail} invited <br />{" "}
                                            {val.visitorName} and used{" "}
                                            {val.idDocType} for ID.
                                        </p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
            <div className="my-3 flex w-full justify-center">
                <button className="btn btn-primary" onClick={printDocument}>
                    Download
                </button>
            </div>
        </div>
    );
};

export default AnalyticsReport;
