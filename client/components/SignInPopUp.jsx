import { useEffect, useState } from "react";
import { gql, useMutation, useApolloClient } from "@apollo/client";
import { ImEnter } from "react-icons/im";
import { AiOutlineCheck } from "react-icons/ai";
import { GiCancel } from "react-icons/gi";
import { useAlert } from "react-alert";
import { transitions, positions, Provider as AlertProvider } from 'react-alert';

import axios from "axios";

import FaceRec from "./FaceRec";
import VisitInfoModal from "./VisitInfoModal";

import useAuth from "../store/authStore";

const SignInPopUp = ({
    refetch,
    showSignInModal,
    setShowSignInModal,
    setSearch,
}) => {
    const alert = useAlert();

    const BACKEND_URL = process.env.BACKEND_URL;
    const token = useAuth((state) => state.access_token);
    const [notes, setNotes] = useState("");
    const [showVerify, setShowVerify] = useState(false);
    const [file, setFile] = useState(null);
    const [pin, setPin] = useState("");
    const [verifyData, setVerifyData] = useState(undefined);
    const time = new Date();
    const client = useApolloClient();
    
    const getInvite = (inviteID) => {
        console.log(showSignInModal);
        showSignInModal && client.query({
            query: gql`
                query {
                    getInvite(inviteID: "${inviteID}") {
                        inviteID,
                        visitorName,
                        userEmail,
                        idDocType,
                        idNumber,
                        inviteDate,
                        inviteState
                    }
                }
            `
        }).then((res) => {
            if(res.data) {
                const invite = res.data.getInvite;
                setVerifyData(invite); 
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    const confirmVerify = async (e) => {
        e.currentTarget.classList.add("loading");

        if(pin.length !== 5) {
            alert.show("Pin must be a 5 digit number", {
                type: "error"
            })
            e.currentTarget.classList.remove("loading");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post(`${BACKEND_URL}/receptionist/signInAndAddFace?inviteID=${verifyData.inviteID}&pin=${pin}`, formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'Authorization': `Bearer ${token}`
            }
        });

        e.target.classList.remove("loading");

        if(response.data.trayNo) {
           setShowVerify(false);
           setShowSignInModal(false);
           setSearch(false);
           setFile(null);
           alert.show(
            `${response.data.action} ${response.data.name} their tray number is ${response.data.trayNo}`,
               {
                type: "info",
              });
            refetch();
        } else {
            setShowVerify(false);
           alert.show(
                `${response.data.error}`,
               {
                    type: "error",
            });
        }
    };

    const onFaceRecSuccess = (data) => {
        if(data.trayNo) {
           setShowSignInModal(false);
           setSearch(false);
           alert.show(
            `${data.action} ${data.name} their tray number is ${data.trayNo}`,
           {
                type: "info",
            });
            refetch();

        } else {
           console.log(data.error);
        }
    };

    const onAddFace = (inviteID) => {
        if(showSignInModal) {
            setShowVerify(true);
            getInvite(inviteID);
        }
    };
    
    const cancelAddFace = () => {
        setShowVerify(false);
    };

    return (
        <div className="relative flex-col items-center justify-center text-center">
            <div className="avatar placeholder online">
                <div className="w-24 rounded-full bg-neutral-focus text-4xl text-neutral-content">
                    <ImEnter />
                </div>
            </div>

            <h1 className="mt-5 text-center text-xl font-bold ">
                Face Recognition to Sign In/Out Visitor
            </h1>

            { !showVerify ?
                <div>
                    <p className="max-w-5/6 mb-3">
                        Ensure face is visible in camera
                    </p>

                    <div>
                        <FaceRec setFile={setFile} onSuccess={onFaceRecSuccess} onAddFace={onAddFace} />
                    </div>
                </div>
                :
                <div>
                    <h2 className="text-center text-xl">Verify Details</h2>

                    <div className="flex flex-col space-y-4">
                        <VisitInfoModal visitModalData={verifyData} />
                        <div className="border p-3 rounded-lg border-2">
                            <p>
                                Enter personal 5-digit verification pin to confirm identity of visitor
                            </p>
                            <input type="password" placeholder="Enter PIN" className="mt-3 input input-bordered w-full max-w-xs input-sm" onChange={(e) => {
                                setPin(e.target.value);
                            }}>
                            </input>
                        </div>
                        <div className="flex justify-center space-x-4">
                            <button className="btn btn-primary" onClick={confirmVerify}>
                                <AiOutlineCheck className="text-xl mr-3" />
                                Verify
                            </button>
                            <button className="btn btn-secondary" onClick={cancelAddFace}>
                                <GiCancel className="text-xl mr-3" />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default SignInPopUp;
