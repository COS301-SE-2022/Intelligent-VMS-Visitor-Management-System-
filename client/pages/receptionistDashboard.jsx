import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { gql, useApolloClient, useLazyQuery } from "@apollo/client";
import { BiQrScan, BiLogIn, BiFace } from "react-icons/bi";
import { FaMailBulk } from "react-icons/fa";
import { BsInfoCircle } from "react-icons/bs";
import QRScanner from "../components/QRScanner";
import Layout from "../components/Layout";
import SignInPopUp from "../components/SignInPopUp";
import SignOutPopUp from "../components/SignOutPopUp";
import VisitInfoModal from "../components/VisitInfoModal";
import ReceptionistSignButton from "../components/receptionistSignButton";
import UploadPopUp from "../components/UploadPopUp";

const ReceptionistDashboard = () => {
    const client = useApolloClient();

    const [searching, setSearch] = useState(false);
    const [searchName, setSearchName] = useState("");

    const [currentButton, setCurrentButton] = useState(() => {});
    const [currentParkingNumber, setCurrentParkingNumber] = useState(-1);
    const [visitorData, setVisitorData] = useState([]);
    const [inActiveInvites, setInactiveInvites] = useState([]);
    const [signedInInvites, setSignedInInvites] = useState([]);

    const [trayNr, setTrayNr] = useState("");

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showInfoAlert, setShowInfoAlert] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [showUploadPopUp, setShowUploadPopUp] = useState(false);
    const [showVisitorModal, setShowVisitorModal] = useState(false);
    const [showSignInModal, setShowSignInModal] = useState(false);
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const [currentVisitData, setCurrentVisitData] = useState("");

    const getFormattedDateString = (date) => {
        if (date instanceof Date) {
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return [
                date.getFullYear(),
                (month > 9 ? "" : "0") + month,
                (day > 9 ? "" : "0") + day,
            ].join("-");
        }
    };

    const [todayString, setTodayString] = useState(
        getFormattedDateString(new Date())
    );

    const router = useRouter();
    const [invitesQuery, { loading, error, data }] = useLazyQuery(
        gql`
        query {
            getInvitesByDate( date: "${todayString}" ) {
                inviteID
                inviteDate
                idNumber
                visitorName
                inviteState
                idDocType
                userEmail
                signInTime
            }
        }
    `,
        { fetchPolicy: "no-cache" }
    );

    const search = () => {
        setSearch(true);

        client
            .query({
                query: gql`
                query{
                    getInvitesByNameForSearch( name: "${searchName}" ) {
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
                const visitors = res.data.getInvitesByNameForSearch.filter(
                    (invite) => {
                        return (
                            (invite.inviteDate >= todayString &&
                            invite.inviteState !== "signedOut" && 
                            invite.inviteState != "cancelled" && 
                            invite.inviteID) 
                            || invite.inviteState === "extended"
                        );
                    }
                );
                setVisitorData(visitors);
            })
            .catch((err) => {});
    };

    const resetDefaultResults = () => {
        if (!loading && !error) {
            const inActiveInvites = data.getInvitesByDate.filter((invite)=>{
                return (
                    invite.inviteDate === todayString &&
                    invite.inviteID &&
                    invite.inviteState === "inActive"
                )
            })
            setInactiveInvites(inActiveInvites);
            const signedInInvites =  data.getInvitesByDate.filter((invite)=>{
                return (
                    invite.inviteID &&
                    (
                    (invite.inviteDate >= todayString &&
                    invite.inviteState === "signedIn") ||
                    invite.inviteState === "extended"
                    )   
                )
            })
            setSignedInInvites(signedInInvites);
            setSearch(false);
        } else if (error) {
            if (error.message === "Unauthorized") {
                router.push("/expire");
                return;
            }

            setVisitorData([
                {
                    visitorEmail: "ERROR",
                    idDocType: "ERROR",
                    isNumber: "ERROR",
                },
            ]);
        }
    };

    useEffect(() => {
        invitesQuery();
        if (!loading && !error) {
            if (data) {
                const inActiveInvites = data.getInvitesByDate.filter((invite)=>{
                    return (
                        invite.inviteDate === todayString &&
                        invite.inviteID &&
                        invite.inviteState === "inActive"
                    )
                })
                setInactiveInvites(inActiveInvites);
                const signedInInvites =  data.getInvitesByDate.filter((invite)=>{
                    return (
                        invite.inviteID &&
                        (
                        (invite.inviteDate >= todayString &&
                        invite.inviteState === "signedIn") ||
                        invite.inviteState === "extended"
                        )   
                    )
                })
                setSignedInInvites(signedInInvites);
            }
        } else if (error) {
            if (error.message === "Unauthorized") {
                router.push("/expire");
                return;
            }

            setVisitorData([
                {
                    visitorID: "ERROR",
                    visitorEmail: "ERROR",
                    idDocType: "ERROR",
                    isNumber: "ERROR",
                },
            ]);
        }
    }, [loading, error, router, data, invitesQuery]);

    return (
        <Layout>
            <div className="input-group w-full p-3">
                <input
                    type="text"
                    placeholder="Search.."
                    className="input input-bordered input-sm w-full md:input-md"
                    onChange={(evt) => {
                        setSearchName(evt.target.value);
                        if (searching === true && evt.target.value === "") {
                            resetDefaultResults();
                        }
                    }}
                />
                <button onClick={search} className="btn btn-sm md:btn-md">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </button>
            </div>

            <div className="flow-root w-full pt-7">
                <div className="float-left flex flex-wrap">
                    <h1 className="base-100 pl-3 text-xl font-bold md:text-3xl lg:text-4xl ">
                        {searching ? "Search Results" : "Today's Invites"}
                    </h1>
                    {searching ? (
                        <label
                            className="btn btn-circle btn-xs ml-2 border-none bg-error"
                            onClick={() => resetDefaultResults()}
                        >
                            ✕
                        </label>
                    ) : (
                        <div></div>
                    )}
                </div>


                <label
                    htmlFor="QRScan-modal"
                    className="modal-button btn btn-tertiary btn-sm float-right mx-3 gap-2 md:btn-md"
                    onClick={() => setShowScanner(true)}
                >
                    <BiQrScan />
                    Scan Invite
                </label>

                <label
                    htmlFor="Upload-modal"
                    className="modal-button btn btn-secondary btn-sm float-right gap-2 md:btn-md"
                    onClick={() => setShowUploadPopUp(true)}
                >
                    <FaMailBulk />
                    Bulk-SignIn
                </label>

                <label
                    htmlFor="signIn-modal"
                    className="modal-button btn btn-primary btn-sm float-right mx-3 gap-2 md:btn-md"
                    onClick={() => setShowSignInModal(true)}
                >
                    <BiFace />
                    Recognize Face
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5 mx-3 h-auto">
                <div className="card h-full bg-base-300 p-3">
                    <div className="flex flex-col">
                        <h2 className="ml-3 text-xl font-bold">
                            IN-ACTIVE INVITES
                        </h2>
                        {loading ? (
                                <progress className="progress progress-primary w-56">
                                    progress
                                </progress>
                            ) : (
                            <div className="flex flex-col justify-center gap-3 overflow-y-scroll p-3">
                                {inActiveInvites.map((visit, idx) => {
                                    return (
                                        <div className="hover:bg-base-200 bg-base-100 shadow-xl m-1 p-5 rounded-lg flex flex-row items-center" key={visit.inviteID}
                                            onClick={() => {
                                                setCurrentVisitData(visit);
                                                setShowVisitorModal(true);
                                            }}>
                                            <BsInfoCircle className="mr-5"/>

                                            <div className="flex flex-col items-start">
                                                <div className="text-lg font-bold capitalize">{visit.visitorName}</div>
                                                <div className="text-md">{visit.idNumber}</div>
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="card h-full bg-base-300 p-3">
                    <div className="flex flex-col">
                        <h2 className="ml-3 text-xl font-bold">
                            OPEN INVITES
                        </h2>
                        {loading ? (
                                <progress className="progress progress-primary w-56">
                                    progress
                                </progress>
                            ) : (
                            <div className="flex flex-col justify-center gap-3 overflow-y-scroll p-3">
                                {signedInInvites.map((visit, idx) => {
                                    return (
                                        <div className="hover:bg-base-200 bg-base-100 shadow-xl m-1 p-5 rounded-lg flex flex-row items-center" key={visit.inviteID}
                                            onClick={() => {
                                                setCurrentVisitData(visit);
                                                setShowVisitorModal(true);
                                            }}>
                                            <BsInfoCircle className="mr-5"/>

                                            <div className="flex flex-col items-start">
                                                <div className="text-lg font-bold capitalize">{visit.visitorName}</div>
                                                <div className="text-md">{visit.idNumber}</div>
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex h-full items-center justify-center overflow-x-auto p-3">
                {loading ? (
                    <progress className="progress progress-primary w-56">
                        progress
                    </progress>
                ) : (
                    <table className="mb-5 table w-full">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Visitor Name</th>
                                <th>Visitor ID</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        {visitorData.length > 0 ? (
                            <tbody>
                                {visitorData.map((visit, idx) => {
                                    return (
                                        <tr
                                            className=" hover relative z-0 cursor-pointer"
                                            key={visit.inviteID}
                                            onClick={() => {
                                                setCurrentVisitData(visit);
                                                setShowVisitorModal(true);
                                            }}
                                        >
                                            <th>
                                                <BsInfoCircle />
                                            </th>
                                            <td className="capitalize">
                                                {visit.visitorName}
                                            </td>
                                            <td>{visit.idNumber}</td>
                                            {!searching ||
                                            visit.inviteDate === todayString ? (
                                                visit.inviteState ===
                                                "inActive" ? (
                                                    <td key={visit.inviteID}>
                                                        <ReceptionistSignButton
                                                            key={visit.inviteID}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                            }}
                                                            text="Not Signed In"
                                                            colour="bg-tertiary"
                                                        />
                                                    </td>
                                                ) : (
                                                    <td key={visit.inviteID}>
                                                        <ReceptionistSignButton
                                                            key={visit.inviteID}
                                                            onClick={(e) => {
                                                                e.stopPropagation();

                                                                setCurrentVisitData(
                                                                    visit
                                                                );

                                                                setCurrentButton(
                                                                    e
                                                                        .currentTarget
                                                                        .classList
                                                                );
                                                                setShowVisitorModal(
                                                                    false
                                                                );
                                                                setShowSignOutModal(
                                                                    true
                                                                );
                                                            }}
                                                            text="Sign Out"
                                                            htmlFor="signOut-modal"
                                                            colour={visit.inviteState==="extended" ? "bg-warning " : "bg-error"}
                                                            signInTime={visit.inviteState==="extended" ? visit.signInTime : null}

                          
                                                        />
                                                    </td>
                                                )
                                            ) : (
                                    
                                                <td>--</td>
                                                
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        ) : (
                            <tbody>
                                <tr>
                                    <th>Nothing to show...</th>
                                </tr>
                            </tbody>
                        )}
                    </table>
                )}
            </div>

            <input
                type="checkbox"
                id="signIn-modal"
                className="modal-toggle"
                onChange={() => {}}
                checked={showSignInModal ? true : false}
            />
            <div className="fade modal cursor-pointer" id="signIn-modal">
                <div className="modal-box">
                    <label
                        htmlFor="signIn-modal"
                        className="btn btn-circle btn-sm"
                        onClick={() => {
                            setShowSignInModal(false);
                        }}
                    >
                        ✕
                    </label>
                    <SignInPopUp
                        showSignInModal={showSignInModal}
                        refetch={invitesQuery}
                        setShowSignInModal={setShowSignInModal}
                        setSearch={setSearch}
                    />
                </div>
            </div>

            <input
                type="checkbox"
                id="signOut-modal"
                className="modal-toggle"
            />

            <input
                type="checkbox"
                id="signOut-modal"
                className="modal-toggle"
                onChange={() => {}}
                checked={showSignOutModal ? true : false}
            />
            <div className="fade modal cursor-pointer" id="signOut-modal">
                <div className="modal-box">
                    <label
                        htmlFor="signOut-modal"
                        className="btn btn-circle btn-sm"
                        onClick={() => {
                            setShowSignOutModal(false);
                        }}
                    >
                        ✕
                    </label>
                    <SignOutPopUp
                        visitData={currentVisitData}
                        setShowInfoAlert={setShowInfoAlert}
                        setTrayNr={setTrayNr}
                        refetch={invitesQuery}
                        currentButton={currentButton}
                        setShowSignOutModal={setShowSignOutModal}
                        setSearch={setSearch}
                    />
                </div>
            </div>

            <input
                type="checkbox"
                id="QRScan-modal"
                className="modal-toggle"
                onChange={() => {}}
                checked={showScanner ? true : false}
            />
            <div className="fade modal" id="QRScan-modal">
                <div className="modal-box flex flex-wrap">
                    <label
                        htmlFor="QRScan-modal"
                        className="btn btn-circle btn-sm absolute right-2 top-2 z-10"
                        onClick={() => {
                            setShowScanner(false);
                        }}
                    >
                        ✕
                    </label>
                    <QRScanner
                        showScanner={showScanner}
                        setCurrentVisitData={setCurrentVisitData}
                        setShowScanner={setShowScanner}
                        setShowVisitorModal={setShowVisitorModal}
                        setShowSignInModal={setShowSignInModal}
                        setShowSignOutModal={setShowSignOutModal}
                        setVisitorData={setVisitorData}
                        setSearch={setSearch}
                        todayString={todayString}
                        setErrorMessage={setErrorMessage}
                        setShowErrorAlert={setErrorMessage}
                    />
                </div>
            </div>

            <input
                type="checkbox"
                id="VistorInfo-modal"
                className="modal-toggle"
                onChange={() => {}}
                checked={showVisitorModal ? true : false}
            />
            <div className="fade modal-lg modal " id="VistorInfo-modal">
                <div className="modal-box flex flex-wrap">
                    <label
                        htmlFor="VistorInfo-modal"
                        className="btn btn-circle btn-sm absolute right-2 top-2 z-10"
                        onClick={() => setShowVisitorModal(false)}
                    >
                        ✕
                    </label>
                    <VisitInfoModal
                        visitModalData={currentVisitData}
                        setCurrentVisitData={setCurrentVisitData}
                        setShowSignOutModal={setShowSignOutModal}
                        setShowVisitorModal={setShowVisitorModal}
                        parkingNumber={currentParkingNumber}
                    />
                </div>
            </div>

            <input
                type="checkbox"
                id="Upload-modal"
                className="modal-toggle"
                checked={showUploadPopUp ? true : false}
            />
            <div className="fade modal" id="Upload-modal">
                <div className="modal-box flex flex-wrap">
                    <label
                        htmlFor="Upload-modal"
                        className="btn btn-circle btn-sm absolute right-2 top-2 z-10"
                        onClick={() => setShowUploadPopUp(false)}
                    >
                        ✕
                    </label>
                    <UploadPopUp
                        setErrorMessage={setErrorMessage}
                        setShowErrorAlert={setShowErrorAlert}
                        setSuccessMessage={setSuccessMessage}
                        setShowSuccessAlert={setShowSuccessAlert}
                        setShowUploadPopUp={setShowUploadPopUp}
                        refetch={invitesQuery}
                    />
                </div>
            </div>
        </Layout>
    );
};

export async function getStaticProps(context) {
    return {
        props: {
            protected: true,
        },
    };
}

export default ReceptionistDashboard;
