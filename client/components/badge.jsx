import React, {useState} from 'react';
import Text from 'react-svg-text';
import { FcGraduationCap,FcHome,FcOvertime,FcConferenceCall,FcAdvertising,FcInvite } from "react-icons/fc";
import {GiNightSleep} from "react-icons/gi";
import {IoTrash} from "react-icons/io";

const Badge = ({colour,text,type,width,desc,level}) => {

    const icon = () => {
        switch(type) {
  
          case "concept": return <FcGraduationCap className="" x={40.879-18} y={26.575-18} size={36}/>; 
          case "invite": return <FcInvite className="" x={40.879-18} y={26.575-18} size={36}/>;
          case "sleepover": return <GiNightSleep className="text-[#1e3a8a]" x={40.879-18} y={26.575-18} size={36} />;
          case "cancellation": return <IoTrash className="text-[#dc2626]" x={40.879-18} y={26.575-18} size={36} />;
          case "time":  return <FcOvertime className="text-[#1e3a8a]" x={40.879-18} y={26.575-18} size={36} />;
          case "visits":  return <FcConferenceCall className="text-[#1e3a8a]" x={40.879-18} y={26.575-18} size={36} />;
          case "suggestion":  return <FcAdvertising className="text-[#1e3a8a]" x={40.879-18} y={26.575-18} size={36} />;
          default: return <FcHome className="text-[#1e3a8a]" x={40.879-18} y={26.575-18} size={36}/>;
        }
      }

    return (
        <svg
        width={width}
        height={1.243155*width}
        viewBox="0 0 82.011 101.97"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g strokeOpacity={0}>

                <path
                    d="m41.009 0-.004 22.511h-.006v79.463H41c5.95-.267 38.403-25.469 39.944-31.23 1.54-5.761 2.037-42.437-2.927-45.739-1.055-.702-4.848-1.26-10.194-1.669a27 27 0 0 0-3.376-9.851A27 27 0 0 0 41.008 0z"
                    fill="grey-100"
                />
                <path
                    d="m41.001 0 .004 22.511h.006v79.463h-.002c-5.95-.267-38.403-25.469-39.944-31.23-1.54-5.761-2.037-42.437 2.927-45.739 1.055-.702 4.848-1.26 10.194-1.669a27 27 0 0 1 3.376-9.851A27 27 0 0 1 41.002 0z"
                    fill="grey-100"
                />
                <circle cx={40.879} cy={26.575} r={23.699} fill={"#fff"} fillOpacity="0.9"/>  

                <path
                    d="m41.009 0-.004 22.511h-.006v79.463H41c5.95-.267 38.403-25.469 39.944-31.23 1.54-5.761 2.037-42.437-2.927-45.739-1.055-.702-4.848-1.26-10.194-1.669a27 27 0 0 0-3.376-9.851A27 27 0 0 0 41.008 0z"
                    fill={colour}
                    fillOpacity={0.85-(level*0.2)}
                />
                <path
                    d="m41.001 0 .004 22.511h.006v79.463h-.002c-5.95-.267-38.403-25.469-39.944-31.23-1.54-5.761-2.037-42.437 2.927-45.739 1.055-.702 4.848-1.26 10.194-1.669a27 27 0 0 1 3.376-9.851A27 27 0 0 1 41.002 0z"
                    fill={colour}
                    fillOpacity={1-(level*0.2)}
                />
                <circle cx={40.879} cy={26.575} r={23.699} fill={"#fff"} fillOpacity="0.9"/>  

                {icon()}
                <Text className="text-[6.5px] tracking-wider" width={72.0011+5} x={41.0055} y={26.575+25} textAnchor="middle" verticalAnchor="middle" fill="white">
                    .........................................
                </Text>
                <Text lineHeight="0.9em" capHeight="1.2em" className="font-noto tracking-wider font-bold text-[9px] p-5" width={72.0011-5} x={41.0055} y={26.575+35} textAnchor="middle" verticalAnchor="middle" fill="white">
                    {text}
                </Text>
                <Text className="text-[6.5px] tracking-wider" width={72.0011+5} x={41.0055} y={26.575+46} textAnchor="middle" verticalAnchor="middle" fill="white">
                    .........................................
                </Text>
                <Text className="text-[8px] font-main" width={41.0055+2} x={41.0055} y={26.575+50} scaleToFit={true} textAnchor="middle" verticalAnchor="start" fill="white">
                    {desc}
                </Text>
            </g>
        </svg>
        

    );
}

export default Badge;
