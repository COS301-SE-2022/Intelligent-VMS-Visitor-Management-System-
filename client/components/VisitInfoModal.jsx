import React, { useEffect, useRef, useState } from "react";

const VisitInfoModal = ({name,tray,}) => {

    return (
    <div className="relative flex-col justify-center items-center text-center">
        <label>{name}</label>
        <lable>{tray}</lable>   
    </div>    
    );
};

export default VisitInfoModal;
