import { useEffect, useState } from "react";

const useVideo = (videoRef) => {
    const [playVideo, setPlayVideo] = useState(true);

    const isVideoPlaying = (video) => { 
        !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
    }
    
    useEffect(() => {
        const play = () => {
            navigator.mediaDevices
              .getUserMedia({ video: { width: "100%" } })
              .then(stream => {
                setVideoStream(stream);
                const video = videoRef.current;
                video.srcObject = stream;

                // Only play video if it is not playing already
                if(!isVideoPlaying) {
                    video.play();
                } 
              }).catch(err => {
                console.error("error:", err);
              });
        };


        if(playVideo === true) {
            play();
        } 

    }, [playVideo, videoRef]);

    
    return [playVideo, setPlayVideo];
};

export default useVideo;
