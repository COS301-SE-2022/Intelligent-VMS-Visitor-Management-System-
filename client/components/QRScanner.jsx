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
