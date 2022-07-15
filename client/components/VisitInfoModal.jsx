import React, { useEffect, useRef, useState } from "react";

const VisitInfoModal = ({ setShowInfo, visitModalData }) => {
    useEffect(() => {
    }, []);
    return (
        <div className="relative flex-auto justify-center items-center text-center w-auto pt-5" >
            {/* display a visitor's name */}
            <label style={{ fontWeight: "bold" }}>Visitor Name: </label>
            <label style={{ fontStyle: "italic", textTransform: 'capitalize' }}>{visitModalData.visitorName}</label>
            <br></br>
            {/* display a visitor's identification document type */}
            <label style={{ fontWeight: "bold" }}>Document type: </label>
            <label style={{ fontStyle: "italic" }}>{visitModalData.idDocType}</label>
            <br></br>
            {/* display a visitor's Identification number. Either ID or passport or student number */}
            <label style={{ fontWeight: "bold" }}>Visitor ID: </label>
            <label style={{ fontStyle: "italic" }}>{visitModalData.idNumber}</label>
            <br></br>
            {/* display the invite's valid date */}
            <label style={{ fontWeight: "bold" }}>Invite date: </label>
            <label style={{ fontStyle: "italic" }}>{visitModalData.inviteDate}</label>
            <br></br>
            {/* display the host's email for emergencies */}
            <label style={{ fontWeight: "bold" }}>Host email: </label>
            <label style={{ fontStyle: "italic" }}>{visitModalData.userEmail}</label>
            <br></br>
            {/* display the invite ID */}
            <label style={{ fontWeight: "bold" }}>Invite ID: </label>
            <label style={{ fontStyle: "italic" }}>{visitModalData.inviteID}</label>
        </div>
    );
};

export default VisitInfoModal;
