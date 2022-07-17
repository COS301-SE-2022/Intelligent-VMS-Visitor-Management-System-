import { useRouter } from "next/router";
import { useState, useEffect, setState } from "react";
import { gql, useQuery, useApolloClient, useLazyQuery } from "@apollo/client";

import { BiQrScan } from "react-icons/bi";

import Layout from "../components/Layout";
import QRScanner from "../components/QRScanner";
import SignInPopUp from "../components/SignInPopUp";
import SignOutPopUp from "../components/SignOutPopUp";
import VisitInfoModal from "../components/VisitInfoModal";
import ReceptionistSignButton from "../components/receptionistSignButton";
import InfoAlert from "../components/InfoAlert";
import ErrorAlert from "../components/ErrorAlert";

const ReceptionistDashboard = () => {
    const [currentVisitorID, setCurrentVisitorID] = useState("");
    const [currentInviteID, setCurrentInviteID] = useState("");
    const [currentVisitorName, setCurrentVisitorName] = useState("");
    const [currentName, setCurrentName] = useState("");
    const [trayNr, setTrayNr] = useState("");

    const [visitorData, setVisitorData] = useState([]);
    const [reload, setReload] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showInfoAlert, setShowInfoAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showScanner, setShowScanner] = useState(false);
    const [visitModalData, setVisitModalData] = useState("");
    const [showVisitorModal, setShowVisitorModal] = useState(false);

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
                # requiresParking
                idDocType
                userEmail
            }
        }
    `,
        { fetchPolicy: "no-cache" }
    );

    const refetch = () => {
        client
            .query(
                {
                    query: gql`
                query{
                    getInvitesByDate( date: "${todayString}" ) {
                        inviteID
                        inviteDate
                        idNumber
                        visitorName
                        inviteState
                        # requiresParking
                        idDocType
                        userEmail
                    }
                }
            `,
                },
                { fetchPolicy: "cache-and-network" }
            )
            .then((res) => {
                const data = res.data.getInvitesByDate.filter((invite) => {
                    return invite.inviteState !== "signedOut";
                });
                setVisitorData([...data]);
            });
    };

    //STEFAN SE CODE
    const [searching, setSearch] = useState(false);

    //--------------------------------------------------------------------

    const client = useApolloClient();

    const search = () => {
        //TODO (Stefan)
        setSearch(true);
        client
            .query({
                query: gql`
                query{
                    getInvitesByNameForSearch( name: "${visitorName}" ) {
                        inviteID
                        inviteDate
                        idNumber
                        visitorName
                        inviteState
                        # requiresParking
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
                            invite.inviteDate === todayString &&
                            invite.inviteState !== "signedOut"
                        );
                    }
                );
                setVisitorData(visitors);
            })
            .catch((err) => {});
    };

    const resetDefaultResults = () => {
        setSearch(false);

        if ((!loading && !error) || reload) {
            const invites = data.getInvitesByDate.filter((invite) => {
                return invite.inviteState !== "signedOut";
            });
            setVisitorData(invites);
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
                const invites = data.getInvitesByDate.filter((invite) => {
                    return invite.inviteState !== "signedOut";
                });
                setVisitorData(invites);
            }
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
    }, [loading, error, router, data]);

    //const [notes, setNotes] = useState("");
    const [visitorName, setName] = useState("");

    //////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <Layout>
            <h1 className="base-100 p-3 text-xl font-bold md:text-3xl lg:text-4xl">
                {searching ? "Search Results" : "Today's Invites"}
            </h1>
            <div className="inline-flex items-center">
                <div className="inline-flex w-full flex-row-reverse items-center justify-end space-x-3">
                    <label
                        htmlFor="QRScan-modal"
                        className="modal-button btn btn-primary btn-sm ml-3 gap-2 md:btn-md"
                        onClick={() => setShowScanner(true)}
                    >
                        <BiQrScan />
                        Scan to Search
                    </label>

                    <div className="input-group justify-end">
                        <input
                            type="text"
                            placeholder="Search.."
                            className="input input-bordered input-sm md:input-md"
                            onChange={(evt) => {
                                setName(evt.target.value);
                                if (
                                    searching === true &&
                                    evt.target.value === ""
                                ) {
                                    resetDefaultResults();
                                }
                            }}
                        />
                        <button
                            onClick={search}
                            className="btn btn-sm md:btn-md"
                        >
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
                </div>
            </div>

            <div className="flex h-full items-center justify-center overflow-x-auto p-3">
                {loading ? (
                    <progress className="progress progress-primary w-56">
                        progress
                    </progress>
                ) : (
                    //TODO (Larisa) dont use table
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
                                        <tr   className="hover" key={idx}  >
                                            {/* Onclicks below display Visitor-Modal and pass it the relavant information for each visitor*/}
                                            <th onClick={() => {setShowVisitorModal(true),setVisitModalData(visit)} }>{idx + 1}</th>
                                            <td className="capitalize" onClick={() => {setShowVisitorModal(true),setVisitModalData(visit)} }>{visit.visitorName}</td>
                                            <td onClick={() => {setShowVisitorModal(true),setVisitModalData(visit)} }>{visit.idNumber}</td>
                                            {visit.inviteState === "inActive" ? (
                                                <td>
                                                    <ReceptionistSignButton
                                                        onClick={() => {
                                                            setCurrentVisitorID(
                                                                visit.idNumber
                                                            );
                                                            setCurrentInviteID(
                                                                visit.inviteID
                                                            );
                                                            setCurrentVisitorName(
                                                                visit.visitorName
                                                            );
                                                            setShowVisitorModal(false);
                                                        }}
                                                        text="Sign In"
                                                        colour="bg-green-800"
                                                        htmlFor="signIn-modal"
                                                    />
                                                </td>
                                            ) : (
                                                <td>
                                                     <ReceptionistSignButton 
                                                     onClick={() => {
                                                        setCurrentVisitorID(
                                                            visit.idNumber
                                                        );
                                                        setCurrentInviteID(
                                                            visit.inviteID
                                                        );
                                                        setShowVisitorModal(false);
                                                        
                                                    }}
                                                     text="Sign Out" 
                                                     htmlFor="signOut-modal" 
                                                     colour="bg-red-800" />
                                                </td>
                                            )}
                                            {/* Visitor-Modal for displaying information on row click */}
                                            <input type="checkbox" id="VistorInfo-modal" className="modal-toggle" onChange={() => {}} checked={showVisitorModal ? true : false} />
                                            <div className="fade modal modal-lg " id="VistorInfo-modal">
                                                <div className="modal-box flex flex-wrap">
                                                    <label
                                                        htmlFor="VistorInfo-modal"
                                                        className="btn btn-circle btn-sm absolute right-2 top-2 z-10"
                                                        onClick={() => setShowVisitorModal(false)}
                                                    >
                                                        ✕
                                                    </label>
                                                    <VisitInfoModal setShowInfo={setShowVisitorModal} visitModalData={visitModalData}/>
                                                </div>
                                            </div>
                                            
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
                <ErrorAlert
                    message={errorMessage}
                    showConditon={showErrorAlert}
                />
                <InfoAlert
                    visitorName={currentVisitorName}
                    showConditon={showInfoAlert}
                    trayNr={trayNr}
                />
            </div>

            <input type="checkbox" id="signIn-modal" className="modal-toggle" />
            <div className="fade modal cursor-pointer" id="signIn-modal">
                <div className="modal-box">
                    <label
                        htmlFor="signIn-modal"
                        className="btn btn-circle btn-sm"
                    >
                        ✕
                    </label>
                    <SignInPopUp
                        visitorID={currentVisitorID}
                        inviteID={currentInviteID}
                        setTrayNr={setTrayNr}
                        setShowInfoAlert={setShowInfoAlert}
                        refetch={invitesQuery}
                        todayString={todayString}
                    />
                </div>
            </div>

            <input
                type="checkbox"
                id="signOut-modal"
                className="modal-toggle"
            />
            <div className="fade modal cursor-pointer" id="signOut-modal">
                <div className="modal-box">
                    <label
                        htmlFor="signOut-modal"
                        className="btn btn-circle btn-sm"
                    >
                        ✕
                    </label>
                    <SignOutPopUp
                        visitorID={currentVisitorID}
                        inviteID={currentInviteID}
                        setShowInfoAlert={setShowInfoAlert}
                        setTrayNr={setTrayNr}
                        refetch={invitesQuery}
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
                        onClick={() => setShowScanner(false)}
                    >
                        ✕
                    </label>
                    <QRScanner
                        setShowScanner={setShowScanner}
                        setVisitorData={setVisitorData}
                        setSearch={setSearch}
                    />
                </div>
            </div>

            {/* <input type="checkbox" id="Info-modal" className="modal-toggle" />
            <div className="fade modal" id="Info-modal">
                <div className="modal-box flex flex-wrap">
                    <label
                        htmlFor="Info-modal"
                        className="btn btn-circle btn-sm absolute right-2 top-2 z-10"
                    >
                        ✕
                    </label>
                    <VisitInfoModal name={currentName} />
                </div>
            </div> */}
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
