import React, { useEffect, useRef, useState } from "react";
import { QrReader } from "react-qr-reader";
import { gql, useApolloClient } from "@apollo/client";

import useVideo from "../hooks/useVideo.hook";

const QRScanner = ({
    setShowScanner,
    setVisitorData,
    setSearch,
}) => {
    //ApolloClient
    const client = useApolloClient();

    // QR Data State
    const [data, setData] = useState("");

    // Video state
    const [showVideo, setShowVideo] = useState(true);

    // Error State
    const [errorMessage, setErrorMessage] = useState("");

    const [showErrorMessage, setShowErrorMessage] = useState(false);

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
                    }
                }
            `,
            })
            .then((res) => {
                //creating an array of 1 element to send to VisitorData
                const visitor = [];
                visitor[0] = res.data.getInvitesByIDForSearch;
                setVisitorData(visitor);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [invalid, setInvalid] = useState(false);

    // DOM Reference to Video element
    const videoRef = useRef(null);

    // Video Player Hook
    //const [playingVideo, setPlayingVideo] = useVideo(videoRef);

    useEffect(() => {
        // Stop video on component unmount
    }, []);

    return (
        <div className="relative flex-col items-center justify-center text-center">
            <p>Ensure that QR Code is visible</p>
            { showErrorMessage &&
                <p className="text-error">{errorMessage}</p>
            }
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
                                        setShowScanner(false);
                                        search(qrData.inviteID);
                                        setShowErrorMessage(false);
                                    } else {
                                        setShowErrorMessage(true);
                                        setErrorMessage("Invalid QR Code");
                                    }
                                } catch (error) {
                                    setShowErrorMessage(true);
                                    setErrorMessage("Invalid QR Code");
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
        </div>
    );
};

export default QRScanner;
