import { useState } from "react";
import axios from "axios";

import Camera from "../components/Camera";

import useAuth from "../store/authStore";

const FaceRec = ({ onSuccess, onFaceAdd }) => {

    const token = useAuth((state) => state.access_token);
    const [options, setOptions] = useState({tryAgain: false, addFace: false});
    const [error, setError] = useState("");
    const [file, setFile] = useState(null);

    const urlToFile = async (url, filename, mimeType) => {
        const res = await fetch(url);
        const buf = await res.arrayBuffer();
        return new File([buf], filename, { type: mimeType });
    };
    
    const submitFaceImage = async (imageData) => {
        setError("");
        const formData = new FormData();
        const file = await urlToFile(imageData, "face.png", "image/png")
        formData.append("file", file);
        const response = await axios.post("http://localhost:3001/receptionist/compareFace?idNumber=0109195273090", formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'Authorization': `Bearer ${token}`
            }
        });
        
        if(response.data) {
            console.log(response.data);
            if(response.data.result) {
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

    return (
        <div>
            <Camera options={options} setOptions={setOptions} buttonText={"Authorize"} onPicture={onPicture} setError={setError}>
                Camera not available
            </Camera>
            <div>
                <p className="text-error">{error && error.length > 0 && error}</p>
            </div>
        </div>
    );
};

export default FaceRec;


