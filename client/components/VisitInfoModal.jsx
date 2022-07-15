import React, { useEffect, useRef, useState } from "react";

const VisitInfoModal = ({setShowInfo,visitModalData}) => {



    useEffect(() => {
        // Stop video on component unmount
    
    }, []);
    return (
    <div className="relative flex-col justify-center items-center text-center" >
        <label>{visitModalData.inviteID}</label>
        <label>{visitModalData.inviteDate}</label>
        <label>{visitModalData.idNumber}</label>
        <label>{visitModalData.visitorName}</label>
        <label>{visitModalData.inviteState}</label>
        <label>{visitModalData.userEmail}</label>
        <label>{visitModalData.idDocType}</label>  
    </div>   
    );
};

export default VisitInfoModal;
