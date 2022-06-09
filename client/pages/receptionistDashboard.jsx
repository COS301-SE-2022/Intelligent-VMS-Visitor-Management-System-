import { useState, useEffect, setState } from "react";
import { gql, useQuery, useApolloClient, useLazyQuery } from "@apollo/client";

import Layout from "../components/Layout";
import ErrorAlert from "../components/ErrorAlert";

import { useRouter } from "next/router";
import QRScanner from "../components/QRScanner";
import SignInPopUp from "../components/SignInPopUp";
import SignOutPopUp from "../components/SignOutPopUp";
import VisitInfoModal from "../components/VisitInfoModal";
import ReceptionistSignButton from "../components/receptionistSignButton";
import InfoAlert from "../components/InfoAlert";

const ReceptionistDashboard = () => {
    
    const [currentVisitorID,setCurrentVisitorID] = useState("");
    const [currentInviteID,setCurrentInviteID] = useState("");
    const [currentVisitorName,setCurrentVisitorName] = useState("");
    const [currentName,setCurrentName] = useState("");
    const [trayNr, setTrayNr] = useState("");
    
    const [visitorData, setVisitorData] = useState([]);
    const [reload, setReload] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showInfoAlert, setShowInfoAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showScanner, setShowScanner] = useState(false);

    const getFormattedDateString = (date) => {
        if(date instanceof Date) {
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return [
                date.getFullYear(),
                (month > 9 ? "" : "0") + month,
                (day > 9 ? "" : "0") + day,
            ].join("-");
        }
    };

    const [todayString, setTodayString] = useState(getFormattedDateString(new Date()));

    const router = useRouter();
    const [invitesQuery, { loading, error, data }] = useLazyQuery(gql`
        query {
            getInvitesByDate( date: "${todayString}" ) {
                inviteID
                inviteDate
                idNumber
                visitorName
                inviteState
            }
        }
    `, { fetchPolicy: "no-cache" });

    
    const refetch = () => {
        client.query({
            query: gql`
                query{
                    getInvitesByDate( date: "${todayString}" ) {
                        inviteID
                        inviteDate
                        idNumber
                        visitorName
                        inviteState
                  
                    }
                }
            `,},
            { fetchPolicy: "cache-and-network" }).then(res => {
              const data = res.data.getInvitesByDate.filter((invite) => {
                return invite.inviteState !== "signedOut"               
              });
              setVisitorData([...data]);
            })
    }

    //STEFAN SE CODE
    const [searching, setSearch] = useState(false);

    //--------------------------------------------------------------------

    const client = useApolloClient();

    const search = () => {
        //TODO (Stefan)
        setSearch(true);
        client.query({
            query: gql`
                query{
                    getInvitesByNameForSearch( name: "${visitorName}" ) {
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
                const visitors = res.data.getInvitesByNameForSearch.filter((invite) => {
                    return invite.inviteDate === todayString && invite.inviteState !== "signedOut"
                });
                setVisitorData(visitors);
            }).catch((err) => {
                
            });
    };

    const resetDefaultResults = () => {
        setSearch(false);

        if ((!loading && !error) || reload) {
            const invites = data.getInvitesByDate.filter((invite) => {
                return invite.inviteState !== "signedOut"
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
        if ((!loading && !error)) {
            if(data) {
                const invites = data.getInvitesByDate.filter((invite) => {
                    return invite.inviteState !== "signedOut"
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
            <div onClick={()=>resetDefaultResults()}>
            <input
                type="text"
                placeholder="Search.."
                className="input input-bordered input-primary ml-5 w-4/6"
                onChange={(evt) => {setName(evt.target.value);
                    if(searching === true && evt.target.value === "")
                    resetDefaultResults();
                }}
            />
            <button onClick={search} className="btn btn-primary ml-5 mt-5 mb-5">
                Search
            </button>
            <label
                htmlFor="QRScan-modal"
                className="modal-button btn btn-primary float-right mr-5 mt-5 mb-5"
                onClick={() => setShowScanner(true) }
            >
                Scan to Search
            </label>

            {searching ? (
                <h1 className="base-100 mt-5 mb-5 p-3 text-left text-4xl font-bold">
                    Search Results:
                </h1>

            ) : (
                <h1 className="base-100 mt-5 mb-5 p-3 text-left text-4xl font-bold">
                    Today&apos;s Invites
                </h1>
            )}

        
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
                                <th></th>
                            </tr>
                        </thead>
                        {visitorData.length > 0 ? (
                            <tbody>
                                {visitorData.map((visit, idx) => {
                                    return (
                                        <tr className="hover" key={idx}>
                                            <th>{idx + 1}</th>
                                            <td className="capitalize">{visit.visitorName}</td>
                                            <td>{visit.idNumber}</td>

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
                                                        
                                                    }}
                                                     text="Sign Out" 
                                                     htmlFor="signOut-modal" 
                                                     colour="bg-red-800" />
                                                </td>

                                            )}
                                        </tr>
                                    )

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
                <ErrorAlert message={errorMessage} showConditon={showErrorAlert} />
                <InfoAlert visitorName={currentVisitorName} showConditon={showInfoAlert} trayNr={trayNr}/>
            </div>

            <input type="checkbox" id="signIn-modal" className="modal-toggle" />
            <div className="fade modal cursor-pointer" id="signIn-modal">
                <div className="modal-box">
                    <label
                        htmlFor="signIn-modal"
                        className="btn btn-circle btn-sm" >
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

            <input type="checkbox" id="signOut-modal" className="modal-toggle" />
            <div className="fade modal cursor-pointer" id="signOut-modal">
                <div className="modal-box">
                    <label
                        htmlFor="signOut-modal"
                        className = "btn btn-circle btn-sm" 
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

            <input type="checkbox" id="QRScan-modal" className="modal-toggle" onChange={() => {}}checked={showScanner ? true : false} />
            <div className="fade modal" id="QRScan-modal">
                <div className="modal-box flex flex-wrap">
                    <label
                        htmlFor="QRScan-modal"
                        className="btn btn-circle btn-sm absolute right-2 top-2 z-10"
                        onClick={() => setShowScanner(false)}
                    >
                        ✕
                    </label>
                    <QRScanner setShowScanner={setShowScanner} setVisitorData={setVisitorData} setSearch={setSearch} />
                </div>
            </div>

            <input type="checkbox" id="Info-modal" className="modal-toggle" />
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
