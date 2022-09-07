import React from 'react';
import { FcGraduationCap,FcBiomass } from "react-icons/fc";

const Badge = ({colour}) => {

    return (
        <svg
            width={309.963}
            height={385.398}
            viewBox="0 0 82.011 101.97"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g strokeOpacity={0}>
            <path
                d="m41.009 0-.004 22.511h-.006v79.463H41c5.95-.267 38.403-25.469 39.944-31.23 1.54-5.761 2.037-42.437-2.927-45.739-1.055-.702-4.848-1.26-10.194-1.669a27 27 0 0 0-3.376-9.851A27 27 0 0 0 41.008 0z"
                fill={colour}
                fillOpacity="0.9"
            />
            <path
                d="m41.001 0 .004 22.511h.006v79.463h-.002c-5.95-.267-38.403-25.469-39.944-31.23-1.54-5.761-2.037-42.437 2.927-45.739 1.055-.702 4.848-1.26 10.194-1.669a27 27 0 0 1 3.376-9.851A27 27 0 0 1 41.002 0z"
                fill={colour}
            />
            <circle cx={40.879} cy={26.575} r={23.699} fill={"#fff"} fillOpacity="0.9"/>  
            <FcGraduationCap x={40.879-18} y={26.575-18} size={36}/> 
            </g>
        </svg>
        

    );
}

export default Badge;
