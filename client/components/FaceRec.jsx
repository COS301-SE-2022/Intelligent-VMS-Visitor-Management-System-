import { useState } from "react";
import { QrReader } from "react-qr-reader";
import axios from "axios";

import Camera from "../components/Camera";

import useAuth from "../store/authStore";

const FaceRec = ({ onSuccess, onAddFace, setFile }) => {

    const BACKEND_URL = process.env.BACKEND_URL;
    const token = useAuth((state) => state.access_token);
    const [options, setOptions] = useState({tryAgain: false, addFace: false});
    const [error, setError] = useState("");
    const [showAddFace, setShowAddFace] = useState(false);

    const urlToFile = async (url, filename, mimeType) => {
        const res = await fetch(url);
        const buf = await res.arrayBuffer();
        return new File([buf], filename, { type: mimeType });
    };
    
    const submitFaceImage = async (imageData) => {
        setFile(null);
        setError("");
        const formData = new FormData();
        const file = await urlToFile(imageData, "face.png", "image/png")
        formData.append("file", file);
        const response = await axios.post(`${BACKEND_URL}/receptionist/compareFace?idNumber=0109195273090`, formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'Authorization': `Bearer ${token}`
            }
        });
        
        if(response.data) {
            if(!response.data.error) {
                onSuccess(response.data);
            } else {
                setError(response.data.error);
                setOptions({
                    tryAgain: true,
                    addFace: response.data.error === "No face matches found"
                });
                
                if(response.data.error === "No face matches found") {
                    setFile(file);
                }
            }
        } else {
            console.error("Something went wrong");
        }

    };

    const onPicture = async (imageData, target) => {
        await submitFaceImage(imageData);
        target.classList.remove("loading");
    };
    
    const addNewFace = () => {
        setOptions({...options, addFace: false});
        setShowAddFace(true);         
        setError("");
    };

    return (
        <div>
            <Camera options={options} setOptions={setOptions} buttonText={"Authorize"} onPicture={onPicture} setError={setError} addNewFace={addNewFace} setShowAddFace={setShowAddFace}>
                Camera not available
            </Camera>
                <div>
                {showAddFace &&
                <div>
                <QrReader className="hidden" videoId="faceRecVideo" onResult={(result, error) => {
                        if(result && showAddFace) {
                            try {
                                const qrData = JSON.parse(result?.text);
                                if(qrData.inviteID) {
                                    onAddFace(qrData.inviteID);
                                }
                            } catch(error) {
                                setError(error);
                            }
                        } else if(error) {
                        }
                    }}/>
                    <p>Present QR Code from Invite</p>
                </div>
                    }
                </div>
            <div>
                <p className="text-error">{error && error.length > 0 && error}</p>
            </div>
        </div>
    );
};

export default FaceRec;


