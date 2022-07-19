import React, { useEffect, useRef, useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";

const VisitInfoModal = ({ 
    setShowInfo, 
    visitModalData ,
    parkingNumber}) => {


        useEffect(() => {
        },);
    return (
        <>
        { visitModalData && 
        <div className="relative w-auto flex-auto items-center justify-center text-center">
            {/* display a visitor's name */}
            <label className="justify-self-end" style={{ fontWeight: "bold" }}>Visitor Name: </label>
            <label style={{ fontStyle: "italic", textTransform: 'capitalize' }}>{visitModalData.visitorName}</label>
            
            {/* display a visitor's identification document type */}
            <label className="justify-self-end" style={{ fontWeight: "bold" }}>Document type: </label>
            <label style={{ fontStyle: "italic" }}>{visitModalData.idDocType}</label>

            {/* display a visitor's Identification number. Either ID or passport or student number */}
            <label className="justify-self-end" style={{ fontWeight: "bold" }}>Visitor ID: </label>
            <label style={{ fontStyle: "italic" }}>{visitModalData.idNumber}</label>
      
            {/* display the invite's valid date */}
            <label className="justify-self-end" style={{ fontWeight: "bold" }}>Invite date: </label>
            <label style={{ fontStyle: "italic" }}>{visitModalData.inviteDate}</label>
          
            {/* display the host's email for emergencies */}
            <label className="justify-self-end" style={{ fontWeight: "bold" }}>Host email: </label>
            <label style={{ fontStyle: "italic" }}>{visitModalData.userEmail}</label>
       
            {/* display the invite ID */}
            <label className="justify-self-end" style={{ fontWeight: "bold" }}>Invite ID: </label>
            <label style={{ fontStyle: "italic" }}>{visitModalData.inviteID}</label>
            
            {/* display the parking Number */}
            <label className="justify-self-end" style={{ fontWeight: "bold" }}>Parking Number: </label>

            {parkingNumber == -1? (
            <label style={{ fontStyle: "italic" }}>N/A</label>
            ):(
            <label style={{ fontStyle: "italic" }}>{parkingNumber}</label>
            )}    

            {/* display the tray Number */}
            <label className="justify-self-end" style={{ fontWeight: "bold" }}>Tray Number: </label>
            <label style={{ fontStyle: "italic" }}>{}</label>
        </div>
        }
        </>
    );
};

export default VisitInfoModal;
