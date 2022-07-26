import { useState, useEffect, CSSProperties } from "react";
import { gql, useQuery, useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";

import Layout from "../components/Layout";
import ErrorAlert from "../components/ErrorAlert";
import DownloadChart from "../components/DownloadChart";
import LineChart from "../components/LineChart";

import useDateRange from "../hooks/useDateRange.hook";

import useAuth from "../store/authStore";

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

const VisitorDashboard = () => {
    const token = useAuth((state) => state.decodedToken)();
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [maxNumInvites, setMaxNumInvites] = useState(0);
    const [totalNumberInvites, setTotalNumberInvites] = useState(0);
    const [todayInvites, setTodayInvites] = useState(0);
    const [openInvites, setOpenInvites] = useState([]);
    const [percentage, setPercentage] = useState(0);
    const [visitorData, setVisitorData] = useState({ data: [], labels: [] });
    const [invites, setInvites] = useState([]);
    const now = getFormattedDateString(new Date());

    const [
        startDate,
        endDate,
        dateMap,
        setDateMap,
        setStartDate,
        setRange,
        range,
    ] = useDateRange(now, 7);

    const router = useRouter();
    const { loading, error, data } = useQuery(
        gql`
            query {
                getInvites {
                    idNumber
                    visitorEmail
                    idDocType
                    inviteID
                    inviteDate
                    inviteState
                }
            }
        `,
        { fetchPolicy: "network-only" }
    );

    const numInvitesQuery = useQuery(
        gql`
            query {
                getNumInvitesPerResident {
                    value
                }
            }
        `,
        { fetchPolicy: "network-only" }
    );

    const client = useApolloClient();
    const cancelInvite = (inviteID) => {
        client
            .mutate({
                mutation: gql`
                mutation {
                    cancelInvite(inviteID: "${inviteID}")
                }
            `,
            })
            .then((res) => {
                const otherInviteData = invites.filter((invite) => {
                    return invite.inviteID !== inviteID;
                });

                const newOpen = openInvites.filter((invite) => {
                    return invite.inviteID !== inviteID && invite.inviteDate >= now;
                });

                setOpenInvites(newOpen);
                setInvites(otherInviteData);
                
                otherInviteData.forEach((invite) => {
                    invite.inviteDate >= now && 
                    dateMap.set(
                        invite.inviteDate,
                        dateMap.get(invite.inviteDate) + 1
                    );
                });
                setDateMap(new Map(dateMap));

                setVisitorData({
                    data: Array.from(dateMap.values()),
                    labels: Array.from(dateMap.keys()),
                });
            })
            .catch((err) => {
                setShowErrorAlert(true);
                setErrorMessage(err.message);
            });
    };

    useEffect(() => {
        if (!loading && !error) {
            const invites = data.getInvites;
            setInvites(invites);

            const tempInvites = [];
            invites.forEach((invite) => {
                if(invite.inviteDate >= now) {
                    dateMap.set(
                        invite.inviteDate,
                        dateMap.get(invite.inviteDate) + 1
                    );
                }

                if (invite.inviteState === "inActive" && invite.inviteDate >= now) {
                    tempInvites.push(invite);
                }
            });

            setOpenInvites(tempInvites);
            setDateMap(new Map(dateMap));

            setVisitorData({
                data: Array.from(dateMap.values()),
                labels: Array.from(dateMap.keys()),
            });
        } else if (error) {
            if (error.message === "Unauthorized") {
                router.push("/expire");
                return;
            }
        }
    }, [loading, error, data, setStartDate, now, router, range]);

    useEffect(() => {
        if (!numInvitesQuery.loading && !numInvitesQuery.error) {
            const maxNum = numInvitesQuery.data.getNumInvitesPerResident.value;
            setMaxNumInvites(maxNum);
            if (maxNumInvites > 0) {
                const percentage = (openInvites.length / maxNumInvites) * 100;
                setPercentage(Math.floor(percentage));
            } else {
                setPercentage(0);
            }
        }
    }, [numInvitesQuery, openInvites.length, maxNumInvites]);

    useEffect(() => {
        const todayInviteData = invites.filter((invite) => {
            return invite.inviteDate === now;
        });
        setTodayInvites(todayInviteData.length);
    }, [invites, now]);

    return (
        <Layout>
            <div className="p-3">
                <h1 className="mt-5 mb-5 flex items-center text-left text-xl md:text-2xl lg:text-4xl font-bold">
                    <span>Welcome back,</span>
                    <span className="ml-3 text-secondary">{token.name}</span>
                </h1>
                <p>You have {todayInvites} visitors expected today.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-1 gap-4">
                <DownloadChart
                    title={"User Invites For The Week"}
                    filename={token.name + "-weekly.png"}
                    Chart={LineChart}
                    labelvals={visitorData.labels}
                    datavals={[visitorData.data]}
                    datalabels={["Visitors"]}
                />
                <div className="flex flex-col gap-5">
                    <div className="card w-full h-full bg-base-200 p-5 shadow">
                        <h2 className="card-title font-normal">
                            Total Number Of Invites Sent
                        </h2>
                        <div className="card-body justify-center">
                            <h1 className="text-4xl font-bold">
                                {invites.length}
                            </h1>
                            <p>Invites Sent In Lifetime</p>
                        </div>
                        <div className="card-actions"></div>
                    </div>
                    <div className="card w-full h-full bg-base-200 p-5 shadow">
                        <h2 className="card-title font-normal">
                            Maximum Invites Allowed
                        </h2>
                        <div className="card-body justify-center">
                            <div className="flex items-center space-x-8">
                                <div className="flex items-center justify-center">
                                    <div
                                        className="radial-progress text-base-content"
                                        style={{ "--value": Number(percentage) }}
                                    >
                                        {percentage}%
                                    </div>
                                </div>
                                <div className="flex-col text-sm md:text-base">
                                    <p>
                                        You currently have {openInvites.length}{" "}
                                        open invites.
                                    </p>
                                    <p>
                                        You are allowed to send {maxNumInvites}{" "}
                                        in total
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="card-actions"></div>
                    </div>
                </div>
                <h2 className="text-3xl font-bold ml-2">Open Invites</h2>
                <div className="col-span-1 md:col-span-2 space-y-4 overflow-x-auto">
                    {loading ? (
                        <progress className="progress progress-primary w-56">
                            progress
                        </progress>
                    ) : (
                        <table className="mb-5 table table-compact md:table-normal w-full m-2">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Email</th>
                                    <th>ID Document Type</th>
                                    <th>ID Number</th>
                                    <th>Date</th>
                                    <th>Cancel Invite</th>
                                </tr>
                            </thead>
                            {openInvites.length > 0 ? (
                                <tbody>
                                    {openInvites.map((visit, idx) => {
                                        return (
                                            <tr className="hover" key={idx}>
                                                <th>{idx + 1}</th>
                                                <td>{visit.visitorEmail}</td>
                                                <td>{visit.idDocType}</td>
                                                <td>{visit.idNumber}</td>
                                                <td>{visit.inviteDate}</td>
                                                <td>
                                                    <button
                                                        aria-label="cancel"
                                                        className="btn btn-primary btn-square"
                                                        onClick={(e) => {
                                                            e.currentTarget.classList.add("loading");
                                                            cancelInvite(
                                                                visit.inviteID
                                                            );
                                                            e.currentTarget.classList.remove("loading");
                                                        }}
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
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </button>
                                                </td>
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
                <ErrorAlert
                    message={errorMessage}
                    showConditon={showErrorAlert}
                />
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

export default VisitorDashboard;
