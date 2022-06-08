import { useState, useEffect, setState } from "react";
import { gql, useQuery, useApolloClient, useLazyQuery } from "@apollo/client";

import Layout from "../components/Layout";
import ErrorAlert from "../components/ErrorAlert";

import { useRouter } from "next/router";
import QRScanner from "../components/QRScanner";
import SignInPopUp from "../components/SignInPopUp";
import SignOutPopUp from "../components/SignOutPopUp";
import VisitInfoModal from "../components/VisitInfoModal";
import ReceptionistSignButton from "../components/ReceptionistSignButton";

const ReceptionistDashboard = () => {
    
    const [currentVisitorID,setCurrentVisitorID] = useState("");
    const [currentInviteID,setCurrentInviteID] = useState("");
    const [currentName,setCurrentName] = useState("");
    
    const [visitorData, setVisitorData] = useState([]);
    const [reload, setReload] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
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

    const todayString = getFormattedDateString(new Date());

    const router = useRouter();
    const { loading, error, data } = useQuery(gql`
        query {
            getInvitesByDate( date: "${todayString}" ) {
                inviteID
                inviteDate
                idNumber
                visitorName
                inviteState
            }
        }
    `);

    const refetch = () => {
        client.query({
            query: gql`
                query{
                    getInvitesByDate( date: "2022-06-02" ) {
                        inviteID
                        inviteDate
                        idNumber
                        visitorName
                        inviteState
                  
                    }
                }
            `,
            }).then(res => {
              const invites = [];
              invites = res.data.getInvitesByDate.filter((invite) => {
                return invite.inviteState !== "signedOut"
              });

              setVisitorData(invites);

            })
    }

    //STEFAN SE CODE
    const [searching, setSearch] = useState(false);

    //--------------------------------------------------------------------

    function refreshPage() {
        window.location.reload(true);
    }

    const client = useApolloClient();
    const search = (name) => {
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
                //alert(res.data);
                const visitors = res.data.getInvitesByNameForSearch.filter((invite) => {
                    return invite.inviteDate === todayString && invite.inviteState !== "signedOut"
                });
                setVisitorData(visitors);
            })
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
        if ((!loading && !error)) {
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
    }, [loading, error, router, data]);


    //const [notes, setNotes] = useState("");
    const [visitorName, setName] = useState("");


    //////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <Layout>
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

        
            {/* <div className="mx-5 grid grid-cols-3 gap-4 content-evenly h-10 bg-base-300 rounded-md content-center">
                <div className="ml-2">Invitation Id</div>
                <div className="">Visitor Id</div>
                <div className=""></div>
            </div> */}
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
                                            <td>{visit.visitorName}</td>
                                            <td>{visit.idNumber}</td>

                                            {visit.inviteState === "inActive" ? (
                                                <td>
                                                    <ReceptionistSignButton text="Sign In" htmlFor="signIn-modal" colour="bg-green-800" />
                                                </td>
                                            ) : (
                                                <td>
                                                     <ReceptionistSignButton text="Sign Out" htmlFor="signOut-modal" colour="bg-red-800" />
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
            </div>
            <ErrorAlert message={errorMessage} showConditon={showErrorAlert} />

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
                        refetch={refetch}
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
                        refetch={refetch}
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
