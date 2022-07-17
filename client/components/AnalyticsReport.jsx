import { useRef, useState } from "react";
import jsPDF from 'jspdf';
import html2canvas from "html2canvas";
import { FaSignInAlt } from "react-icons/fa";

const AnalyticsReport = ({ data, name, total, startDate, endDate }) => {
    const [loading,setLoading] = useState(false);
    const inputRef = useRef(null);
    const now = new Date();
    
    const printDocument = () => {
        setLoading(true);
        html2canvas(inputRef.current, {useCORS: true}).then((canvas) => {
          setLoading(false);
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF();
          pdf.addImage(imgData, "PNG", 0, 0);
          pdf.save("download.pdf");
        });
    };
    
    return(
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
                            <span className="capitalize text-secondary-content">
                                {name}
                            </span>
                        </h1>
                    </div>
                </div>
                <div className="px-3 text-primary-content">
                    <h2 className="text-base font-bold text-base-content">
                        Total Number Of Invites
                    </h2>
                    <p className="text-xl font-bold text-primary">{total}</p>
                    <div className="divider"></div>
                    <h2 className="text-base font-bold">Invite Data</h2>
                    <div className="flex-col">
                        {!data || data.length === 0 ? <div>Nothing to show...</div> : data.map((val, idx) => {
                            return (
                                <div className="block text-sm" key={idx}>
                                    <p>
                                        {idx+1}. User ({val.userEmail}) invited ({val.visitorEmail}) on {val.inviteDate}
                                    </p> 
                                    <p>
                                        Invitation State: {val.inviteState}
                                    </p>
                                    <p>
                                        {val.inviteState === "signedIn" && val.signInTime}
                                    </p>
                                    <br />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-center my-3">
                <button className={"btn btn-primary " + (loading && "loading")} onClick={printDocument}>Download</button>
            </div>
        </div>
    );
};

export default AnalyticsReport;
