import React, { useEffect, useRef, useState, setState } from "react";
import { QrReader } from 'react-qr-reader';

const QrScanner = ({showCondition}) => {
    const videoRef = useRef(null);
    const [data, setData] = useState('No result');

    useEffect(() => {
        getVideo();
      }, [videoRef]);
    
      const getVideo = () => {
        navigator.mediaDevices
          .getUserMedia({ video: { width: 300 } })
          .then(stream => {
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
            
          })
          .catch(err => {
            console.error("error:", err);
          });
      };

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
                        if (!!result) {
                          setData(result?.text);
                        }

                        if (!!error) {
                          console.info(error);
                        }
                      }}
                      style={{ width: '100%' }}
                    />
                    <p>{data}</p>
                  
      </div>
    );
};

export default QrScanner;
