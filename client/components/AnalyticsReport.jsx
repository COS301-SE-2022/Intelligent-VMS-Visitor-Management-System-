import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import { FaSignInAlt } from "react-icons/fa";

const AnalyticsReport = ({ data, name, total, startDate, endDate }) => {
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const now = new Date();

    const printDocument = () => {
        setLoading(true);
        const doc = jsPDF();

        const tableColumn = ["User", "Visitor", "Date", "Status"];
        const tableRows = [];

        doc.text("User Report For " + name, 10, 15);
        data.forEach((invite) => {
            const inviteData = [
                invite.userEmail,
                invite.visitorEmail,
                invite.inviteDate,
                invite.inviteState,
            ];

            tableRows.push(inviteData);
        });
        doc.autoTable(tableColumn, tableRows, { startY: 20 });
        const date = Date().split(" ");
        doc.save(`report_${name}.pdf`);
        setLoading(false);
    };

    return (
        <div className="mt-3 flex-col p-3">
            <h1 className="text-3xl font-bold">User Activity Report</h1>
            <div className="my-3 flex w-full justify-center">
                <button
                    className={"btn btn-primary " + "loading"}
                    onClick={printDocument}
                >
                    Download
                </button>
            </div>
        </div>
    );
};

export default AnalyticsReport;
