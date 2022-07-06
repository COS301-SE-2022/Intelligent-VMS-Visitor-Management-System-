import React, { useEffect, useRef, useState } from "react";

const VisitInfoModal = ({ name, tray }) => {
    return (
        <div className="relative flex-col items-center justify-center text-center">
            <label>{name}</label>
            <label>{tray}</label>
        </div>
    );
};

export default VisitInfoModal;
