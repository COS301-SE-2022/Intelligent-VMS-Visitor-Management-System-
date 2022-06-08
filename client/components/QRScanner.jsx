import React, { useEffect, useRef, useState } from "react";
import { QrReader } from "react-qr-reader";

import useVideo from "../hooks/useVideo.hook";

const QrScanner = () => {

    const [invalid,setInvalid] = useState(false);
    const [show,setShow] = useState(true);

    // DOM Reference to Video element
    const videoRef = useRef(null);

    // QR Data State
    // TODO (Stefan) this data variable holds the result of the scan
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
                            if (qrData.inviteID) {
                                setData(qrData.inviteID); 
                                alert(qrData.inviteID);
                            } else {
                                setInvalid(true);
                            }
                        } 
                      }}
                    />
        </div>
        {invalid ? (
            <p>Invalid QR</p>
        ):(
            <p className="hidden"></p>
        )}
        
</div>    
                );
};

export default QrScanner;
