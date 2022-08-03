import { useRouter } from "next/router";
import { useState, useEffect, setState } from "react";
import { gql, useApolloClient, useLazyQuery } from "@apollo/client";
import { BiQrScan } from "react-icons/bi";
import { BsBoxArrowInRight } from "react-icons/bs";
import Layout from "../components/Layout";
import QRScanner from "../components/QRScanner";
import SignInPopUp from "../components/SignInPopUp";
import SignOutPopUp from "../components/SignOutPopUp";
import VisitInfoModal from "../components/VisitInfoModal";
import ReceptionistSignButton from "../components/receptionistSignButton";
import InfoAlert from "../components/InfoAlert";
import UploadPopUp from "../components/UploadPopUp";
import ErrorAlert from "../components/ErrorAlert";
import SuccessAlert from "../components/SuccessAlert";

const ReceptionistDashboard = () => {

    const client = useApolloClient();

    const [searching, setSearch] = useState(false); 
    const [searchName, setSearchName] = useState("");

    const [currentVisitorID, setCurrentVisitorID] = useState("");
    const [currentInviteID, setCurrentInviteID] = useState("");
    const [currentVisitorName, setCurrentVisitorName] = useState("");
    const [currentParkingNumber, setCurrentParkingNumber] = useState(-1);
    const [visitorData, setVisitorData] = useState([]);

    const [trayNr, setTrayNr] = useState("");
    
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showInfoAlert, setShowInfoAlert] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [showUploadPopUp, setShowUploadPopUp] = useState(false);
    const [showVisitorModal, setShowVisitorModal] = useState(false);
    const [visitModalData, setVisitModalData] = useState("");
    

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
                            invite.inviteDate >= todayString &&
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

        if ((!loading && !error)) {
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
                    return invite.inviteState !== "signedOut" && invite.inviteID;
                });
                console.log(invites);
                setVisitorData(invites);
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
                    className="input input-bordered input-sm md:input-md w-full"
                    onChange={(evt) => {
                        setSearchName(evt.target.value);
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

            <div className="flow-root w-full pt-7">
                
                <h1 className="base-100 pl-3 text-xl font-bold md:text-3xl lg:text-4xl float-left">
                    {searching ? "Search Results" : "Today's Invites"}
                </h1>
                    
                <label
                    htmlFor="QRScan-modal"
                    className="modal-button btn btn-primary gap-2 btn-sm mx-3 md:btn-md float-right"
                    onClick={() => setShowScanner(true)}
                >
                    <BiQrScan />
                    Scan
                </label>

                <label
                    htmlFor="Upload-modal"
                    className="modal-button btn btn-secondary gap-2 btn-sm md:btn-md float-right"
                    onClick={() => setShowUploadPopUp(true)}
                >
                    <BsBoxArrowInRight/>
                    Bulk-SignIn
                </label> 
           
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
                                        <tr className="relative z-0 hover cursor-pointer" 
                                            key={visit.inviteID} 
                                            onClick={() => {
                                                setVisitModalData(visit)
                                                setShowVisitorModal(true);
                                            }} >

                                            <th></th>
                                            <td className="capitalize" >{visit.visitorName}</td>
                                            <td>{visit.idNumber}</td>
                                            { !searching || visit.inviteDate=== todayString ? (
                                                visit.inviteState === "inActive" ? (
                                                    <td key={visit.inviteID}>
                                                        <ReceptionistSignButton
                                                            key={visit.inviteID}
                                                            onClick={(e) => {
                                                                e.currentTarget.classList.add("loading");
                                                                e.stopPropagation();
                                                                setCurrentVisitorID(
                                                                    visit.idNumber
                                                                );
                                                                setCurrentInviteID(
                                                                    visit.inviteID
                                                                );
                                                                setCurrentVisitorName(
                                                                    visit.visitorName
                                                                );      
                                                            }}
                                                            text="Sign In"
                                                            colour="bg-success"
                                                            htmlFor="signIn-modal"
                                                        
                                                        />
                                                    </td>
                                                ) : (
                                                    <td key={visit.inviteID}>
                                                        <ReceptionistSignButton
                                                            key={visit.inviteID}
                                                            onClick={(e) => {
                                                                e.currentTarget.classList.add("loading");
                                                                e.stopPropagation();
                                                                setCurrentVisitorID(
                                                                    visit.idNumber
                                                                );
                                                                setCurrentInviteID(
                                                                    visit.inviteID
                                                                );
                                                                setCurrentVisitorName(
                                                                    visit.visitorName
                                                                );      
                                                                setShowVisitorModal(
                                                                    false
                                                                );
                                                            }}
                                                            text="Sign Out"
                                                            htmlFor="signOut-modal"
                                                            colour="bg-error"
                                                        />
                                                    </td>
                                                )
                                            ):(<td>--</td>)
                                            }
                                                    
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
                <SuccessAlert
                    message={successMessage}
                    showConditon={showSuccessAlert}
                />
                { showInfoAlert &&
                <InfoAlert
                    visitorName={currentVisitorName}
                    showConditon={showInfoAlert}
                    setShowCondition={setShowInfoAlert}
                    trayNr={trayNr}
                />
                }
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
                        onClick={() => {setShowScanner(false); setShowErrorAlert(false);}}
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
                    <VisitInfoModal 
                        setShowInfo={setShowVisitorModal} 
                        visitModalData={visitModalData} 
                        parkingNumber={currentParkingNumber}/>
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
