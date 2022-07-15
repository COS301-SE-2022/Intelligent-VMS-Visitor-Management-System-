import React, { useEffect, useRef, useState } from "react";

const VisitInfoModal = ({ setShowInfo, visitModalData }) => {



    useEffect(() => {
        // Stop video on component unmount

    }, []);
    return (
        <div className="relative flex-col justify-center items-center text-center" >
            <label>{visitModalData.visitorName}</label>
            <label>{visitModalData.idDocType}</label>
            <label>{visitModalData.idNumber}</label>
            <label>{visitModalData.userEmail}</label>
            <label>{visitModalData.inviteDate}</label>
            <label>{visitModalData.inviteID}</label>

            <table className="mb-5 table w-full">
                <thead>
                    <tr>
                        <th>Visitor Name</th>
                        <th>Document type</th>
                        <th>Visitor ID</th>
                        <th>Invite date</th>
                        <th>Host email</th>
                        <th>Invite ID</th>
                    </tr>
                </thead>

                <tbody>
                    <tr className="hover" key={idx}  >
                        <th ></th>
                        <td></td>
                        <td ></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>


        </div>
    );
};

export default VisitInfoModal;
