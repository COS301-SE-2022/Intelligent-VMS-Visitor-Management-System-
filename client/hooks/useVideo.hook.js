import { useEffect, useState } from "react";

const useVideo = (ref) => {
    const [playVideo, setPlayVideo] = useState(false);
    const [videoRef, setVideoRef] = useState(ref);

    const isVideoPlaying = video => !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
    
    useEffect(() => {
        const play = () => {
            navigator.mediaDevices
              .getUserMedia({ video: { width: 300 } })
              .then(stream => {
                let video = videoRef.current;
                video.srcObject = stream;

                // Only play video if it is not playing already
                if(!isVideoPlaying) {
                    video.play();
                }
              })
              .catch(err => {
                console.error("error:", err);
              });
        };

        const stop = (videoRef) => {
            if(videoRef) {
                videoRef.current.pause();
            }
        };

        if(playVideo === true) {
            play();
        } else {
            stop();            
        }
        
    }, [playVideo, videoRef]);
    
    return [playVideo, setPlayVideo];
};

export default useVideo;
