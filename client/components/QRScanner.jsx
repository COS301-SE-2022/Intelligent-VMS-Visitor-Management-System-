import React, { useEffect, useRef, useState } from "react";
import { QrReader } from 'react-qr-reader';

import useVideo from "../hooks/useVideo.hook"; 

const QrScanner = () => {

    // DOM Reference to Video element
    const videoRef = useRef(null);

    // QR Data State
    const [data, setData] = useState('No result');

    // Video Player Hook
    const [playingVideo, setPlayingVideo] = useVideo(videoRef);

    useEffect(() => {
        // Stop video on component unmount
    
    }, []);

    return (
 <div className="relative flex-col justify-center items-center text-center">
     <div>
         <video className = "relative rounded-lg" ref={videoRef} id="videoElement" />
        <QrReader className="hidden" videoId="videoElement"
                    onResult={(result, error) => {
                        if (result) {
                          const qrData = JSON.parse(result?.text);
                            if(qrData.inviteID) {
                                setData(qrData.inviteID);
                                setPlayingVideo(false);
                            } else {
                                console.error("Invalid QR");
                            }
                        } else if (error) {
                        }
                      }}
                    />
        </div>
        <p>{data}</p>
</div>    
                );
};

export default QrScanner;
