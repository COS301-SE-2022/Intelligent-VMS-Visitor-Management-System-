import { useEffect, useState, useRef } from "react";
import { MdFaceUnlock, MdLoop } from "react-icons/md"; 

const Camera = ({ children, onPicture, addFace, buttonText, options, setOptions, setError }) => {

    const canvasRef = useRef(null);
    const videoRef = useRef(null);

    let videoStream = null;

    const [canvasDims, setCanvasDims] = useState({ width: 0, height: 0});

    const handleVideo = (stream) => {
        if(document) {
            videoStream = stream;
            videoRef.current.srcObject = stream;
        }
    };

    const handleVideoError = (err) => {
    };
    
    const tryAgain = () => {
        setError("");
        setOptions({ tryAgain: false, addFace: false});
    };

    const takePicture = async (e) => {
        e.currentTarget.classList.add("loading");
        const context = await canvasRef.current.getContext("2d");
        if(videoRef.current.clientWidth && videoRef.current.clientHeight) {
            setCanvasDims({ 
                ...canvasDims,
                width: videoRef.current.clientWidth,
                height: videoRef.current.clientHeight
            });

            await context.drawImage(videoRef.current, 0, 0, videoRef.current.clientWidth, videoRef.current.clientHeight);
            const data = await canvasRef.current.toDataURL('image/ ');
            onPicture(data, e.target);
        } else {
            e.target.classList.remove("loading");
        }
    };

    useEffect(() => {
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({video: true})
                .then(handleVideo)
                .catch(handleVideoError);
        }

        return () => {
            if(videoStream) {
                videoStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [videoStream]);

    return(
        <div>
            <video className="rounded-lg" ref={videoRef} autoPlay={true}>
                Camera not available
            </video>
            {
                !options.tryAgain && !options.addFace ?
                <button className="btn btn-primary mt-3 w-full" onClick={takePicture}>{buttonText}</button>
                :
                <div className="space-x-4">
                    { options.addFace && 
                    <button className="btn btn-secondary mt-3" onClick={addFace}>
                        <span className="mr-2">
                            <MdFaceUnlock className="text-lg"/>
                        </span>
                        Add Face
                    </button>
                    }
                    <button className="btn btn-warning mt-3" onClick={tryAgain}>
                        <span className="mr-2">
                            <MdLoop className="text-lg"/>
                        </span>
                        Try Again
                    </button>
                </div>
            }
            <canvas ref={canvasRef} width={canvasDims.width} height={canvasDims.height} className="hidden"></canvas>
        </div>
    );
};

export default Camera;
