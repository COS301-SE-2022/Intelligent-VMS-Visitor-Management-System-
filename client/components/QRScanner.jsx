import React, { useEffect, useRef, useState } from "react";
import { QrReader } from "react-qr-reader";
import { gql, useApolloClient } from "@apollo/client";

import useVideo from "../hooks/useVideo.hook";

const QrScanner = ({ setShowScanner, setVisitorData, setSearch }) => {

    const client = useApolloClient();
    const search = (name) => {
        //TODO (Stefan)
        //alert("HOS MANNE");
        setSearch(true);
        client.query({
            query: gql`
                query{
                    getInvitesByIDForSearch( inviteID: "63a28d62-e726-4768-8b63-eb7b8604d18f" ) {
                        inviteID
                        inviteDate
                        idNumber
                        visitorName
                        inviteState
                    }
                }
            `,
        })
            .then((res) => {
                //alert(res.data);
                alert("IN THEN");
                const visitors = res.data.getInvitesByIDForSearch;
                setVisitorData(visitors);
            })
    };

    const [invalid,setInvalid] = useState(false);

    // DOM Reference to Video element
    const videoRef = useRef(null);

    // QR Data State
    // TODO (Stefan) this data variable holds the result of the scan
    const [data, setData] = useState('No result');

    // Video Player Hook
    //const [playingVideo, setPlayingVideo] = useVideo(videoRef);

    useEffect(() => {
        // Stop video on component unmount
    
    }, []);

    return (
 <div className="relative flex-col justify-center items-center text-center">
    <p></p>
     <div>
        <video className = "relative rounded-lg" ref={videoRef} id="videoElement" />
                <QrReader className="hidden" videoId="videoElement"
                        onResult={(result, error) => {
                            if (result) {
                                try {
                                    const qrData = JSON.parse(result?.text);
                                    if (qrData.inviteID) {
                                        setData(qrData.inviteID); 
                                        setShowScanner(false);
                                        search("test");
                                        //alert(qrData.inviteID);
                                    } else {
                                        setInvalid(true);
                                    }
                                } catch(error) {
                                    setInvalid(true);
                                }
                            } else if(error){

                            }
                          }}
                        />
            </div>
        </div>    
        );
};

export default QrScanner;
