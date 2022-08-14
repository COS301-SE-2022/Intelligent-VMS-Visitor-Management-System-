import React, { useEffect, useRef, useState } from "react";
import { QrReader } from "react-qr-reader";
import { gql, useApolloClient } from "@apollo/client";
import { TiWarning } from "react-icons/ti";

import useVideo from "../hooks/useVideo.hook";

const QRScanner = ({
    setCurrentVisitData,
    setShowScanner,
    setShowSignInModal,
    setShowSignOutModal,
    setVisitorData,
    setSearch,
    todayString,
    setErrorMessage,
    setShowErrorAlert,
}) => {
    //ApolloClient
    const client = useApolloClient();

    // QR Data State
    const [data, setData] = useState("");

    // Video state
    const [showVideo, setShowVideo] = useState(true);

    //Search function that actually queries the database
    const search = (data) => {
        //setting the searching variable to true in order to update the table heading
        setSearch(true);

        client
            .query({
                query: gql`
                query{
                    getInvitesByIDForSearch( inviteID: "${data}" ) {
                        inviteID
                        inviteDate
                        idNumber
                        visitorName
                        inviteState
                        idDocType
                        userEmail
                    }
                }
            `,
            })
            .then((res) => {
                var invites = res.data.getInvitesByIDForSearch;

                //TODO (Larisa): this might be affected by the invite extension
                if (invites.inviteDate !== todayString) {
                    setErrorMessage("Invite is not scheduled for today.");
                    setShowErrorAlert(true);
                } else {
                    if (invites.inviteState === "signedOut") {
                        setErrorMessage("Invite already signed out!");
                        setShowErrorAlert(true);
                    } else {
                        setShowScanner(false);
                        setCurrentVisitData(res.data.getInvitesByIDForSearch);

                        //creating an array of 1 element to send to VisitorData
                        const visitor = [];
                        visitor.push(res.data.getInvitesByIDForSearch);
                        setVisitorData(visitor);

                        console.log(invites.inviteState);
                        if (invites.inviteState === "inActive") {
                            setShowSignInModal(true);
                        } else if (invites.inviteState === "signedIn") {
                            setShowSignOutModal(true);
                        }
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // DOM Reference to Video element
    const videoRef = useRef(null);

    // Video Player Hook
    //const [playingVideo, setPlayingVideo] = useVideo(videoRef);

    useEffect(() => {
        // Stop video on component unmount
    }, []);

    return (
        <div className="relative flex-col items-center justify-center text-center">
            {showVideo ? (
                <div>
                    <video
                        className="relative rounded-lg"
                        ref={videoRef}
                        id="videoElement"
                    />
                    <QrReader
                        className="hidden"
                        videoId="videoElement"
                        onResult={(result, error) => {
                            if (result) {
                                try {
                                    const qrData = JSON.parse(result?.text);
                                    if (qrData.inviteID) {
                                        setData(qrData.inviteID);
                                        search(qrData.inviteID);
                                    } else {
                                        setErrorMessage("Invalid QR Code");
                                        setShowErrorAlert(true);
                                    }
                                } catch (error) {
                                    setErrorMessage("Invalid QR Code");
                                    setShowErrorAlert(true);
                                }
                            } else if (error) {
                                if (error.name === "NotFoundError") {
                                    setShowVideo(false);
                                }
                            }
                        }}
                    />
                </div>
            ) : (
                <div className="w-full text-left">
                    <p className="text-error">
                        Camera not available, use search bar using visitor name.
                    </p>
                </div>
            )}

            <div class="mt-3 flex justify-center">
                <span class="fill-bg-error h-full w-6 fill-current align-middle text-error">
                    <TiWarning size="lg" color="bg-error" />
                </span>
                <p class="ml-2 font-bold text-error">
                    Ensure that QR Code is visible
                </p>
            </div>
        </div>
    );
};

export default QRScanner;
