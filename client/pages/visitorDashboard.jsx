import { useState, useEffect } from "react";
import { gql, useQuery, useApolloClient } from "@apollo/client";

import Layout from "../components/Layout";
import ErrorAlert from "../components/ErrorAlert";

import { useRouter } from "next/router";

const VisitorDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [visitorData, setIsVisitorData] = useState([]);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const router = useRouter();
    const { loading, error, data } = useQuery(gql`
        query {
            getInvites {
                idNumber
                visitorEmail
                idDocType
                inviteID
            }
        }
    `);
    
    const CANCEL_INVITE_MUTATION = gql`
        mutation {
            cancelInvite(inviteID: ${undefined})
        }
    `;

    const client = useApolloClient();
    const cancelInvite = (inviteID) => {
        setIsLoading(true);
        client.mutate({
            mutation: gql`
                mutation {
                    cancelInvite(inviteID: "${inviteID}")
                }
            `
        }).then((res) => {
            setIsLoading(false);
            if(res.data.cancelInvite === true) {
                setIsVisitorData(visitorData.filter((invite) => {
                    return invite.inviteID !== inviteID;
                }))
            } else {
                showErrorAlert("Something Went Wrong");
            }

        }).catch((err) => {
            setIsLoading(false);
            setShowErrorAlert(true);
            showErrorAlert(err.message);
        });
    };

    useEffect(() => {
        if (!loading && !error) {
            setIsLoading(false);
            const invites = data.getInvites;
            setIsVisitorData(invites);
        } else if (error) {
            setIsLoading(false);

            if (error.message === "Unauthorized") {
                router.push("/expire");
                return;
            }

            setIsVisitorData([
                {
                    visitorEmail: "ERROR",
                    idDocType: "ERROR",
                    isNumber: "ERROR",
                },
            ]);
        }
    }, [loading, error, router, data]);

    return (
        <Layout>
            <h1 className="mt-5 mb-5 text-center text-4xl font-bold underline underline-offset-auto">
                Visitor History
            </h1>
            <div className="flex h-full items-center justify-center overflow-x-auto p-3">
                {isLoading ? (
                    <progress className="progress progress-primary w-56">progress</progress>
                ) : (
                    <table className="mb-5 table w-full">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Email</th>
                                <th>ID Document Type</th>
                                <th>ID Number</th>
                                <th>Cancel Invite</th>
                            </tr>
                        </thead>
                        { visitorData.length > 0 ?
                            <tbody>
                                {(
                                    visitorData.map((visit, idx) => {
                                        return (
                                            <tr className="hover" key={idx}>
                                                <th>{idx + 1}</th>
                                                <td>{visit.visitorEmail}</td>
                                                <td>{visit.idDocType}</td>
                                                <td>{visit.idNumber}</td>
                                                <td>
                                                    <button className="btn btn-square" onClick={() => cancelInvite(visit.inviteID)}>
                                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                  </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) 
                                }
                            </tbody>
                            :
                            <tbody>
                                <tr>
                                    <th>
                                        Nothing to show...
                                    </th>
                                </tr>
                            </tbody>
                        }
                    </table>
                )}
            </div>
            <ErrorAlert message={errorMessage} showConditon={showErrorAlert}/>
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

export default VisitorDashboard;
