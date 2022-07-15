import React, { useEffect, useRef, useState } from "react";

const VisitInfoModal = ({ setShowInfo, visitModalData }) => {



    useEffect(() => {
        // Stop video on component unmount

    }, []);
    return (
        <div className="relative flex-auto justify-center items-center text-center w-auto pt-7" >
            {/* <label>{visitModalData.visitorName}</label>
            <label>{visitModalData.idDocType}</label>
            <label>{visitModalData.idNumber}</label>
            <label>{visitModalData.userEmail}</label>
            <label>{visitModalData.inviteDate}</label>
            <label>{visitModalData.inviteID}</label> */}

            <table className="mb-5 table w-auto mx-4">
                {/* <thead>
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
                    <tr className="hover">
                        <td>{visitModalData.visitorName}</td>
                        <td>{visitModalData.idDocType}</td>
                        <td>{visitModalData.idNumber}</td>
                        <td>{visitModalData.inviteDate}</td>
                        <td>{visitModalData.userEmail}</td>
                        <td>{visitModalData.inviteID}</td>
                    </tr>
                </tbody> */}
                <tbody>
                    <tr className="hover">
                        <th>Visitor Name</th>
                        <td>{visitModalData.visitorName}</td>
                    </tr>
                    <tr className="hover">
                        <th>Document type</th>
                        <td>{visitModalData.idDocType}</td>
                    </tr>
                    <tr className="hover">
                        <th>Visitor ID</th>
                        <td>{visitModalData.idNumber}</td>
                    </tr>
                    <tr className="hover">
                        <th>Invite date</th>
                        <td>{visitModalData.inviteDate}</td>
                    </tr>
                    <tr className="hover">
                        <th>Host email</th>
                        <td>{visitModalData.userEmail}</td>
                    </tr>
                    <tr className="hover">
                        <th>Invite ID</th>
                        <td>{visitModalData.inviteID}</td>
                    </tr>
                   
                </tbody>

            </table>


        </div>
    );
};

export default VisitInfoModal;
