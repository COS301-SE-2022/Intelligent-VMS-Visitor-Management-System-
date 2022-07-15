import React, { useEffect, useRef, useState } from "react";

const VisitInfoModal = ({ setShowInfo, visitModalData }) => {



    useEffect(() => {
        // Stop video on component unmount

    }, []);
    return (
        <div className="relative flex-auto justify-center items-center text-center w-auto pt-7" >
            

            <label style={{fontWeight: "bold"}}>Visitor Name: </label>
            <label style={{fontStyle: "italic"}}>{visitModalData.visitorName}</label>
            <br></br>

            <label style={{fontWeight: "bold"}}>Document type: </label>
            <label style={{fontStyle: "italic"}}>{visitModalData.idDocType}</label>
            <br></br>

            <label style={{fontWeight: "bold"}}>Visitor ID: </label>
            <label style={{fontStyle: "italic"}}>{visitModalData.idNumber}</label>
            <br></br>

            <label style={{fontWeight: "bold"}}>Invite date: </label>
            <label style={{fontStyle: "italic"}}>{visitModalData.inviteDate}</label>
            <br></br>

            <label style={{fontWeight: "bold"}}>Host email: </label>
            <label style={{fontStyle: "italic"}}>{visitModalData.userEmail}</label>
            <br></br>

            <label style={{fontWeight: "bold"}}>Invite ID: </label>
            <label style={{fontStyle: "italic"}}>{visitModalData.inviteID}</label>
        </div>
    );
};

export default VisitInfoModal;
