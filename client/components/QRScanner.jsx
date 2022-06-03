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
        <div className="w-auto flex justify-center items-center">
                        <video className = "relative rounded-lg" ref = {videoRef} autoPlay={true} id="videoElement">
                        <a href="#">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="absolute h-6 w-6 flex-shrink-0 stroke-current"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                            </svg>
                            </a>
                        </video>
                     
                    <QrReader className = "rounded-lg"
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
