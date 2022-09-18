import { useEffect, useState } from "react";
import { gql, useMutation, useApolloClient } from "@apollo/client";
import { alert } from "react-custom-alert";
import { ImEnter } from "react-icons/im";
import { AiOutlineCheck } from "react-icons/ai";
import { GiCancel } from "react-icons/gi";

import axios from "axios";

import FaceRec from "./FaceRec";
import VisitInfoModal from "./VisitInfoModal";

import useAuth from "../store/authStore";

const SignInPopUp = ({
    refetch,
    setShowSignInModal,
    setSearch,
}) => {
    const BACKEND_URL = process.env.BACKEND_URL;
    const token = useAuth((state) => state.access_token);
    const [notes, setNotes] = useState("");
    const [showVerify, setShowVerify] = useState(false);
    const [file, setFile] = useState(null);
    const [verifyData, setVerifyData] = useState(undefined);
    const time = new Date();
    const client = useApolloClient();
    
    const getInvite = (inviteID) => {
        client.query({
            query: gql`
                query {
                    getInvite(inviteID: "${inviteID}") {
                        inviteID,
                        visitorName,
                        userEmail,
                        idDocType,
                        idNumber,
                        inviteDate
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
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post(`${BACKEND_URL}/receptionist/signInAndAddFace?inviteID=${verifyData.inviteID}`, formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'Authorization': `Bearer ${token}`
            }
        });

        console.log(response.data);
        e.target.classList.remove("loading");

        if(response.data.trayNo) {
           setShowSignInModal(false);
           setSearch(false);
           setFile(null);
           alert({
                message: `Tray Number For ${response.data.name}: ${response.data.trayNo}`,
                type: "info",
            });
            refetch();
        } else {
            setShowVerify(false);
           alert({
                message: `Error: ${response.data.error}`,
                type: "error",
            });
        }
    };

    const onFaceRecSuccess = (data) => {
        if(data.trayNo) {
           setShowSignInModal(false);
           setSearch(false);
           alert({
                message: `Tray Number For ${data.name}: ${data.trayNo}`,
                type: "info",
            });
            refetch();

        } else {
           console.log(data.error);
        }
    };

    const onAddFace = (inviteID) => {
        setShowVerify(true);
        getInvite(inviteID);
    };
    
    const cancelAddFace = () => {
        setShowVerify(false);
    };

    /*
    useEffect(() => {
        if (!loading && !error) {
            if (data) {
                refetch();
                alert({
                    message: `Tray Number For ${visitData.visitorName}: ${data.signIn}`,
                    type: "info",
                });
                setSearch(false);
            }
        } else {
        }

    }, [loading, error, data]);
    */

    return (
        <div className="relative flex-col items-center justify-center text-center">
            <div className="avatar placeholder online">
                <div className="w-24 rounded-full bg-neutral-focus text-4xl text-neutral-content">
                    <ImEnter />
                </div>
            </div>

            <h1 className="mt-5 text-center text-3xl font-bold ">
                Sign In
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
