import React, { useEffect, useRef, useState } from "react";

const VisitInfoModal = ({setShowInfo,myInputdata}) => {



    useEffect(() => {
        // Stop video on component unmount
    
    }, []);
    return (
     

    <div className="relative flex-col justify-center items-center text-center" >
        <label>{myInputdata.inviteID}</label>
        <lable></lable>   
    </div>   
    );
};

export default VisitInfoModal;
