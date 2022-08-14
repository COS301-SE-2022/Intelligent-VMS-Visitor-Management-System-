import Link from "next/link";
import { useState, useEffect } from "react";
import { gql, useQuery, useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";

import { BiMailSend } from "react-icons/bi";
import { AiFillAlert } from "react-icons/ai";

import Layout from "../components/Layout";
import AlertGroup from "../components/AlertGroup";
import Alert from "../components/Alert";
import DownloadChart from "../components/DownloadChart";
import LineChart from "../components/LineChart";
import VisitorCard from "../components/VisitorCard";

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
    const [inviteModal, setInviteModal] = useState({
        show: false,
        data: undefined,
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [maxNumInvites, setMaxNumInvites] = useState(0);
    const [totalNumberInvites, setTotalNumberInvites] = useState(0);
    const [todayInvites, setTodayInvites] = useState(0);
    const [openInvites, setOpenInvites] = useState([]);
    const [percentage, setPercentage] = useState(0);
    const [visitorData, setVisitorData] = useState({ data: [], labels: [] });
    const [historyInvites, setHistoryInvites] = useState([]);
    const [invites, setInvites] = useState([]);
    const [visitors, setVisitors] = useState([]);
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
                    visitorName
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

    const visitorsQuery = useQuery(
        gql`
            query {
              getVisitors(email: "${token.email}") {
                _id,
                visitorName,
                numInvites
              }
            }
        `
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
                    return (
                        invite.inviteID !== inviteID && invite.inviteDate >= now
                    );
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
                setErrorMessage(err);
            });
    };

    useEffect(() => {
        if (!loading && !error) {
            const invites = data.getInvites;
            setInvites(invites);

            const tempInvites = [];
            const tempHistoryInvites = [];
            invites.forEach((invite) => {
                if (invite.inviteDate >= now) {
                    dateMap.set(
                        invite.inviteDate,
                        dateMap.get(invite.inviteDate) + 1
                    );
                }

                if (
                    invite.inviteDate < now ||
                    invite.inviteState === "signedOut" ||
                    invite.inviteState === "signedIn"
                ) {
                    tempHistoryInvites.push(invite);
                }

                if (
                    invite.inviteState === "inActive" &&
                    invite.inviteDate >= now
                ) {
                    tempInvites.push(invite);
                }
            });

            tempHistoryInvites.sort((lhs, rhs) => {
                return new Date(rhs.inviteDate) - new Date(lhs.inviteDate);
            });

            setOpenInvites(tempInvites);
            setDateMap(new Map(dateMap));
            setHistoryInvites(tempHistoryInvites);

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
        if (!visitorsQuery.loading && !visitorsQuery.error) {
            setVisitors(visitorsQuery.data.getVisitors);
        }
    }, [visitorsQuery]);

    useEffect(() => {
        const todayInviteData = invites.filter((invite) => {
            return invite.inviteDate === now;
        });
        setTodayInvites(todayInviteData.length);
    }, [invites, now]);

    return (
        <Layout>
            <AlertGroup>
                <Alert
                    message={errorMessage}
                    showAlert={showErrorAlert}
                    error
                />
            </AlertGroup>
            <div className="p-3">
                <h1 className="mt-5 mb-5 flex items-center text-left text-xl font-bold md:text-2xl lg:text-4xl">
                    <span>Welcome back,</span>
                    <span className="ml-3 text-secondary">{token.name}</span>
                </h1>
                <p>You have {todayInvites} visitors expected today.</p>
            </div>
            <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-1">
                <DownloadChart
                    title={"User Invites For The Week"}
                    filename={token.name + "-weekly.png"}
                    Chart={LineChart}
                    labelvals={visitorData.labels}
                    datavals={[visitorData.data]}
                    datalabels={["Visitors"]}
                />
                <div className="flex flex-col gap-5">
                    <div className="card h-full w-full bg-base-200 p-5 shadow">
                        <h2 className="card-title font-normal">
                            <span className="text-2xl text-primary">
                                <BiMailSend />
                            </span>
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
                    <div className="card h-full w-full bg-base-200 p-5 shadow">
                        <h2 className="card-title font-normal">
                            <span className="text-2xl text-primary">
                                <AiFillAlert />
                            </span>
                            Maximum Invites Allowed
                        </h2>
                        <div className="card-body justify-center">
                            <div className="flex items-center space-x-8">
                                <div className="flex items-center justify-center">
                                    <div
                                        className="radial-progress text-base-content"
                                        style={{
                                            "--value": Number(percentage),
                                        }}
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
                <div className="col-span-2">
                    <div className="card h-full w-full bg-base-300 p-5 shadow">
                        <div className="card-body grid grid-cols-2 gap-6 justify-center">
                            <div className="col-span-1 space-y-5">
                                <h2 className="card-title text-2xl">
                                    Popular Visitors
                                </h2>
                                <div className="space-y-4">
                                {visitorsQuery.loading ? (
                                    <div className="progress progress-primary"></div>
                                ) : visitors.length === 0 ? (
                                    <p>Nothing to show...</p>
                                ) : (
                                    visitors.map((visitor, idx) => {
                                        return (
                                            <VisitorCard key={idx} name={visitor.visitorName} email={visitor._id} numInvites={visitor.numInvites}/>
                                        );
                                    })
                                )}
                                </div>
                            </div>
                            <div className="col-span-1 space-y-5">
                                <h2 className="card-title text-2xl">
                                    Favorite Visitors
                                </h2>
                                <div className="space-y-4">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <h2 className="divider col-span-2 ml-2 text-3xl font-bold">
                    Open Invites
                </h2>
                <div className="col-span-1 space-y-4 overflow-x-auto md:col-span-2">
                    {loading ? (
                        <progress className="progress progress-primary w-56">
                            progress
                        </progress>
                    ) : (
                        <table className="table-compact mb-3 table w-full md:table-normal">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Name</th>
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
                                                <td className="capitalize">
                                                    {visit.visitorName}
                                                </td>
                                                <td>{visit.idDocType}</td>
                                                <td>{visit.idNumber}</td>
                                                <td>{visit.inviteDate}</td>
                                                <td>
                                                    <button
                                                        key={visit.inviteID}
                                                        aria-label="cancel"
                                                        className="btn btn-primary btn-square"
                                                        onClick={(e) => {
                                                            if (
                                                                !e.currentTarget.classList.contains(
                                                                    "loading"
                                                                )
                                                            ) {
                                                                e.currentTarget.classList.add(
                                                                    "loading"
                                                                );
                                                            }
                                                            cancelInvite(
                                                                visit.inviteID
                                                            );
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
                    <div className="grid grid-cols-1 gap-4">
                        <div className="grid min-h-0 grid-cols-1">
                            <h2 className="divider col-span-2 ml-2 mt-5 text-3xl font-bold">
                                Invite History
                            </h2>
                            <table className="table-compact row-span-1 table w-full md:table-normal">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th>ID Document Type</th>
                                        <th>Date</th>
                                        <th>Invite State</th>
                                    </tr>
                                </thead>
                                {historyInvites.length > 0 ? (
                                    <tbody>
                                        {historyInvites.map((visit, idx) => {
                                            return (
                                                <tr
                                                    onClick={() => {
                                                        setInviteModal({
                                                            show: true,
                                                            data: {
                                                                name: visit.visitorName,
                                                                id: visit.idNumber,
                                                                doc: visit.idDocType,
                                                                email: visit.visitorEmail,
                                                            },
                                                        });
                                                    }}
                                                    className="hover cursor-pointer"
                                                    key={idx}
                                                >
                                                    <th>{idx + 1}</th>
                                                    <td className="capitalize">
                                                        {visit.visitorName}
                                                    </td>
                                                    <td>{visit.idDocType}</td>
                                                    <td>{visit.inviteDate}</td>
                                                    <td>
                                                        {visit.inviteState ===
                                                        "inActive" ? (
                                                            <div className="badge">
                                                                In Active
                                                            </div>
                                                        ) : visit.inviteState ===
                                                          "signedIn" ? (
                                                            <div className="badge badge-success">
                                                                Signed In
                                                            </div>
                                                        ) : (
                                                            <div className="badge badge-error">
                                                                Signed Out
                                                            </div>
                                                        )}
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
                        </div>
                    </div>
                </div>
            </div>
            <input
                type="checkbox"
                id="invite-modal"
                className="modal-toggle"
                checked={inviteModal.show ? true : false}
            />
            <div className="modal">
                {inviteModal.data && (
                    <div className="modal-box relative">
                        <label
                            onClick={() =>
                                setInviteModal({ ...inviteModal, show: false })
                            }
                            htmlFor="invite-modal"
                            className="btn btn-circle btn-sm absolute right-2 top-2"
                        >
                            ✕
                        </label>
                        <h3 className="text-lg font-bold">
                            Would you like to invite{" "}
                            <span className="capitalize text-secondary">
                                {inviteModal && inviteModal.data.name}
                            </span>{" "}
                            again?
                        </h3>
                        <p className="py-4">
                            You will be redirected to the create invite page to
                            specify details for the invitation.
                        </p>
                        <div className="modal-action">
                            <Link
                                href={
                                    "/createInvite?name=" +
                                    inviteModal.data.name +
                                    "&idNumber=" +
                                    inviteModal.data.id +
                                    "&idDocType=" +
                                    inviteModal.data.doc +
                                    "&email=" +
                                    inviteModal.data.email
                                }
                            >
                                <a className="btn btn-primary">Yes</a>
                            </Link>
                        </div>
                    </div>
                )}
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
