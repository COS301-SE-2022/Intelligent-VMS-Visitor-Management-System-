import React, { useEffect, useRef, useState } from "react";
import { QrReader } from "react-qr-reader";
import { gql, useApolloClient } from "@apollo/client";
import { TiWarning } from "react-icons/ti";

const QRScanner = ({
    setCurrentVisitData,
    setShowScanner,
    setShowSignInModal,
    setShowSignOutModal,
    setShowVisitorModal,
    setVisitorData,
    todayString,
    setShowErrorAlert,
    showScanner,
}) => {
    //ApolloClient
    const client = useApolloClient();
    
    // QR Data State
    const [data, setData] = useState("");

    // Video state
    const [showVideo, setShowVideo] = useState(true);
    
    const [errorMessage, setErrorMessage] = useState(undefined);

    const [searching, setSearching] = useState(false);

    //Search function that actually queries the database
    const search = (data) => {

        if(searching) {
            return;
        }

        setSearching(true);
        
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
                const invites = res.data.getInvitesByIDForSearch;
                setShowScanner(false);
                setCurrentVisitData(invites);
                setShowVisitorModal(true);
                setSearching(false);
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
            {showVideo && showScanner ? (
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
                            if (result && showScanner) {
                                try {
                                    const qrData = JSON.parse(result?.text);
                                    if (qrData.inviteID) {
                                        setData(qrData.inviteID);
                                        search(qrData.inviteID);
                                    } else if(showScanner) {
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
            <div className="mt-3 flex justify-center">
                <span className="fill-bg-error h-full w-6 fill-current align-middle text-error">
                    <TiWarning size="lg" color="bg-error" />
                </span>
                <p className="ml-2 font-bold text-error">
                    { !errorMessage ? "Ensure that the QR Code is visible" : errorMessage }
                </p>
            </div>
        </div>
    );
};

export default QRScanner;
