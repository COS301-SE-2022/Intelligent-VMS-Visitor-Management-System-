import React, {useState} from 'react';
import Text from 'react-svg-text';
import { FcGraduationCap,FcHome,FcOvertime,FcConferenceCall,FcAdvertising,FcInvite,FcFullTrash } from "react-icons/fc";
import {GiNightSleep} from "react-icons/gi";
import {AiFillDelete} from "react-icons/ai";

const Badge = ({colour,title,type,width,desc,active,level,xp}) => {

    const icon = () => {

        switch(type) {
          case "concept": return <FcGraduationCap className="" x={40.879-18} y={26.575-18} size={36} opacity={active? 1 : 0.5} />; 
          case "invite": return <FcInvite className="" x={40.879-18} y={26.575-18} size={36} opacity={active? 1 : 0.5}/>;
          case "sleepover": return <GiNightSleep className="text-[#1e3a8a]" x={40.879-18} y={26.575-18} size={36} opacity={active? 1 : 0.5}/>;
          case "cancellation": return <AiFillDelete className="text-[#ea580c]" x={40.879-18} y={26.575-18} size={36} opacity={active? 1 : 0.5}/>;
          case "time": return <FcOvertime className="" x={40.879-18} y={26.575-18} size={36} opacity={active? 1 : 0.5}/>;
          case "visits": return <FcConferenceCall className="" x={40.879-18} y={26.575-18} size={36} opacity={active? 1 : 0.5} />;
          case "suggestion": return <FcAdvertising className="" x={40.879-18} y={26.575-18} size={36} opacity={active? 1 : 0.5}/>;
          default: return <FcHome x={40.879-18} y={26.575-18} size={36} opacity={active? 1 : 0.5}/>;
        }
    }

    var desc3 = "";
    var desc2 = "";
    var desc1 = "";

    if(desc.length>14){
        
        for (var i=14;i>=0;i--){
            if(desc[i].localeCompare(" ")==0){
                desc1 = desc.substr(0,i);
                desc2 = desc.substr(i,desc.length).trim();
                break;
            }
        }
    }
    
    if(desc2.length>11){
        for (var i=11;i>=0;i--){
            if(desc2[i].localeCompare(" ")==0){
                desc3 = desc2.substr(i,desc2.length).trim();
                desc2 = desc2.substr(0,i);
                break;
            }
        }
    }

    var w1 = "text-["+(desc1.length*0.9).toFixed(1).toString()+"px] ";
    var w2 = "text-["+(desc2.length*0.9).toFixed(1).toString()+"px] ";
    var w3 = "text-["+(desc3.length*0.9).toFixed(1).toString()+"px] ";

    console.log(desc1)
    console.log("desc 1 length: "+desc1.length)
    console.log("desc 1: "+w1)
    console.log(desc2)
    console.log("desc 2 length: "+desc2.length)
    console.log("desc 2: "+w2)
    console.log(desc3)
    console.log("desc 3 length: "+desc3.length)
    console.log("desc 3: "+w3)


    if(!active){

        colour="#a8a29e";

    } else {

        switch(type) {
            case "concept": colour="#be185d";
            break;
            case "invite": colour="#84cc16";
            break;
            case "sleepover": colour="#1e3a8a";
            break;
            case "cancellation": colour="#ea580c";
            break;
            case "time":  colour="#dc2626";
            break;
            case "visits":  colour="#facc15";
            break;
            case "suggestion": colour="#ea580c";
            break;
            default: colour="#be185d";
          }
    }

    return (
        <svg
        width={width}
        height={1.2195*width}
        viewBox="0 0 83.619131 101.97407"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g strokeOpacity={0}>

                {/*Background*/}
                <path
                    style={{
                        fill: "grey-300",
                        fillOpacity: 1,
                        strokeWidth: 1,
                        strokeOpacity: 0,
                    }}
                    d="m41.015.001-.004 22.51h-.006v79.463h.002c2.83-.127 11.66-5.9 20.305-12.537a12.17 12.17 0 0 0 10.136 5.442A12.17 12.17 0 0 0 83.62 82.71a12.17 12.17 0 0 0-4.32-9.3c.895-1.096 1.477-2.008 1.653-2.665 1.54-5.761 2.036-42.437-2.928-45.739-1.055-.702-4.848-1.26-10.194-1.669a27 27 0 0 0-3.376-9.851A27 27 0 0 0 41.015 0Z"
                />
                
                <path
                    d="m41.007 0 .004 22.511h.006V54l.001 47.974h-.003c-5.949-.268-38.403-25.469-39.944-31.23-1.54-5.761-2.037-42.437 2.927-45.739 1.055-.702 4.848-1.26 10.194-1.669a27 27 0 0 1 3.376-9.851A27 27 0 0 1 41.008 0z"
                    fill="grey-300"
                    style={{
                        strokeOpacity: 0,
                    }}
                />

                {/* <circle
                    cx={40.885}
                    cy={26.575}
                    r={23.699}
                    fill={active? "#fff" : "#78716c"}
                    fillOpacity="0.9"
                    style={{
                        strokeOpacity: 0,
                    }}
                /> */}

                {/* <path
                    d="m41.009 0-.004 22.511h-.006v79.463H41c5.95-.267 38.403-25.469 39.944-31.23 1.54-5.761 2.037-42.437-2.927-45.739-1.055-.702-4.848-1.26-10.194-1.669a27 27 0 0 0-3.376-9.851A27 27 0 0 0 41.008 0z"
                    fill="grey-100"
                />
                <path
                    d="m41.001 0 .004 22.511h.006v79.463h-.002c-5.95-.267-38.403-25.469-39.944-31.23-1.54-5.761-2.037-42.437 2.927-45.739 1.055-.702 4.848-1.26 10.194-1.669a27 27 0 0 1 3.376-9.851A27 27 0 0 1 41.002 0z"
                    fill="grey-100"
                /> 
                <circle cx={40.879} cy={26.575} r={23.699} fill={"#fff"} fillOpacity="0.9"/>  
                */}

                {/*front*/}

                <path
                    fill={colour}
                    fillOpacity={0.85-(level*0.2)}
                    style={{
                        strokeWidth: 1,
                        strokeOpacity: 0,
                    }}
                    d="m41.015.001-.004 22.51h-.006v79.463h.002c2.83-.127 11.66-5.9 20.305-12.537a12.17 12.17 0 0 0 10.136 5.442A12.17 12.17 0 0 0 83.62 82.71a12.17 12.17 0 0 0-4.32-9.3c.895-1.096 1.477-2.008 1.653-2.665 1.54-5.761 2.036-42.437-2.928-45.739-1.055-.702-4.848-1.26-10.194-1.669a27 27 0 0 0-3.376-9.851A27 27 0 0 0 41.015 0Z"
                />
                    
                <path
                    d="m41.007 0 .004 22.511h.006V54l.001 47.974h-.003c-5.949-.268-38.403-25.469-39.944-31.23-1.54-5.761-2.037-42.437 2.927-45.739 1.055-.702 4.848-1.26 10.194-1.669a27 27 0 0 1 3.376-9.851A27 27 0 0 1 41.008 0z"
                    fill={colour}
                    fillOpacity={1-(level*0.2)}
                    style={{
                        strokeOpacity: 0,
                    }}
                />
                    
                <circle
                    cx={40.885}
                    cy={26.575}
                    r={23.699}
                    fill={"#fff"}
                    fillOpacity={active? "0.87": "0.5"}
                    style={{
                        strokeOpacity: 0,
                    }}
                />
                    
                <circle
                    fill={"#fff"}
                    fillOpacity={active? "0.87": "0.5"}
                    style={{
                        strokeWidth: 0.553302,
                        strokeOpacity: 0,
                    }}
                    cx={71.339}
                    cy={82.587}
                    r={10.223}
                />

                <Text className="text-[30px] font-noto font-bold" width={9} x={71.339} y={82.587} scaleToFit={true} textAnchor="middle" verticalAnchor="middle" fill={active? colour: "#525252"}>
                    {xp? (xp + " XP") : (Math.trunc(10*level)+" XP")}
                </Text>

                {/* <path
                    d="m41.009 0-.004 22.511h-.006v79.463H41c5.95-.267 38.403-25.469 39.944-31.23 1.54-5.761 2.037-42.437-2.927-45.739-1.055-.702-4.848-1.26-10.194-1.669a27 27 0 0 0-3.376-9.851A27 27 0 0 0 41.008 0z"
                    fill={colour}
                    fillOpacity={0.85-(level*0.2)}
                />
                <path
                    d="m41.001 0 .004 22.511h.006v79.463h-.002c-5.95-.267-38.403-25.469-39.944-31.23-1.54-5.761-2.037-42.437 2.927-45.739 1.055-.702 4.848-1.26 10.194-1.669a27 27 0 0 1 3.376-9.851A27 27 0 0 1 41.002 0z"
                    fill={colour}
                    fillOpacity={1-(level*0.2)}
                />
                <circle cx={40.879} cy={26.575} r={23.699} fill={"#fff"} fillOpacity="0.9"/> */}

                {icon()}
                {/* <Text className="text-[6.5px] tracking-wider" width={72.0011+5} x={41.0055} y={26.575+25} textAnchor="middle" verticalAnchor="middle" fill="white">
                    ...........................
                </Text> */}
                <Text lineHeight="0.9em" capHeight="1.2em" className="font-noto tracking-wider font-bold text-[9px] p-5" width={72.0011-5} x={41.0055} y={26.575+33} textAnchor="middle" verticalAnchor="middle" fill="white">
                    {title}
                </Text>
                <Text className="text-[6.5px] tracking-wider" width={72.0011+5} x={41.0055} y={26.575+45} textAnchor="middle" verticalAnchor="middle" fill="white">
                    ...........................
                </Text>
                <Text className={w1+" font-main"} width={41.0055+2} x={41.0055} y={26.575+51} scaleToFit={true} textAnchor="middle" verticalAnchor="start" fill="white">
                    {desc1}
                </Text>
                <Text className={w2+" font-main"} width={41.0055+2} x={41.0055} y={26.575+57} scaleToFit={true} textAnchor="middle" verticalAnchor="start" fill="white">
                    {desc2}
                </Text>
                <Text className={w3+" font-main"} width={41.0055+2} x={41.0055} y={26.575+63} scaleToFit={true} textAnchor="middle" verticalAnchor="start" fill="white">
                    {desc3}
                </Text>
                
            </g>
        </svg>
        

    );
}

export default Badge;
