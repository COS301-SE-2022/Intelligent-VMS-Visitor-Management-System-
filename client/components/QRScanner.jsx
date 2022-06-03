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
        return () => {
            setPlayingVideo(false);
        };
    }, [setPlayingVideo]);

    return (
        <div className="w-full flex flex-col justify-center items-center">
                    <div className="popup max-w-lg rounded-lg" >
                        <video className="rounded-lg" ref={videoRef} id="videoElement"></video>
                    </div> 
                    <QrReader
                      videoId="videoElement"
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
                      style={{ width: '100%' }}
                    />
                <p>{data}</p>
      </div>
    );
};

export default QrScanner;
