import React, { useEffect, useRef, useState } from "react";
import { QrReader } from "react-qr-reader";

import useVideo from "../hooks/useVideo.hook";

const QrScanner = ({ setShowScanner }) => {

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
