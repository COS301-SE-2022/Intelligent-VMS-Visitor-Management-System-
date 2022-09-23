import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { gql, useApolloClient, useLazyQuery, useQuery } from "@apollo/client";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { HiOutlineDocumentReport } from "react-icons/hi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { BiCheckShield } from "react-icons/bi";
import { BsShieldX } from "react-icons/bs";

import useDateRange from "../hooks/useDateRange.hook";

import Layout from "../components/Layout";
import DownloadChart from "../components/DownloadChart";
import LineChart from "../components/LineChart";

import useAuth from "../store/authStore";

const UserAnalytics = () => {
    const router = useRouter();
    const { name, email, permission } = router.query;
    const token = useAuth((state) => state.decodedToken)();
    const client = useApolloClient();

    const now = new Date();
    const [
        startDate,
        endDate,
        dateMap,
        setDateMap,
        setStartDate,
        setRange,
        range,
    ] = useDateRange(now, 7);

    const [reportStartDate, setReportStartDate] = useState(startDate);
    const [reportEndDate, setReportEndDate] = useState(endDate);
    const [generatingReport, setGeneratingReport] = useState(false);

    const generateReport = (invites) => {
        const doc = jsPDF();

        const tableColumn = ["User", "Visitor", "Date", "Status", "Sign In Time", "Sign Out Time"];
        const tableRows = [];

        doc.text(`User Report For ${name} - (${reportStartDate} to ${reportEndDate})`, 10, 15);
        invites.forEach((invite) => {
            const inviteData = [
                token.email,
                invite.visitorEmail,
                invite.inviteDate,
                invite.inviteState,
                invite.signInTime ? invite.signInTime : "--",
                invite.signOutTime ? invite.signOutTime : "--"
            ];

            tableRows.push(inviteData);
        });
        doc.autoTable(tableColumn, tableRows, {
            startY: 20,
            didParseCell: (data) => {
                if (data.column.index === 3 && data.column.raw !== "Status") {
                    switch (data.column.raw) {
                        case "signedIn":
                            data.cell.styles.textColor = "green";
                            break;

                        case "signedOut":
                            data.cell.styles.textColor = "red";
                            break;
                    }
                }
            },
        });
        doc.save(`report_${name}.pdf`);
        setGeneratingReport(false);
    };

    const deleteUserAccount = (email, type) => {
        client
            .mutate({
                mutation: gql`
                mutation {
                    deleteUserAccount(email: "${email}") 
                }
            `,
            })
            .then((res) => {
                if (res.data.deleteUserAccount === true) {
                    router.push("/adminDashboard");
                } else {
                    console.log("ERROR!");
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const authorizeUserAccount = (email, type) => {
        client
            .mutate({
                mutation: gql`
                mutation {
                    authorizeUserAccount(email: "${email}")
                }
            `,
            })
            .then((res) => {
                if (res.data.authorizeUserAccount === true) {
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const deauthorizeUserAccount = (email, type) => {
        client
            .mutate({
                mutation: gql`
                    mutation {
                        deauthorizeUserAccount(email: "${email}")
                    }
                `,
            })
            .then((res) => {
                console.log(res.data);
                if (res.data.deauthorizeUserAccount === true) {
                    console.log("DONE!");
                }
            })
            .catch((err) => {});
    };

    // Visitor invite data object for chart
    const [visitorVals, setVisitorVals] = useState({
        data: [],
        labels: [],
        label: "Invites",
    });

    const [numInvites, setNumInvites] = useState(0);

    const [auth, setAuth] = useState(permission >= 0 ? true : false);

    const [showConfirm, setShowConfirm] = useState(false);

    const type =
        permission === 1 || permission === -1
            ? "Receptionist"
            : permission === 2 || permission === -2
            ? "Resident"
            : permission === 0
            ? "Admin"
            : "Unknown";

    const { loading, error, data } = useQuery(gql`
        query {
            getNumInvitesPerDateOfUser(dateStart: "${startDate}", dateEnd: "${endDate}", email: "${email}") {
                visitorEmail,
                visitorName,
                inviteDate
            }
        }
    `);

    const [getInvitesForReport, getInvitesForReportQuery] = useLazyQuery(gql`
        query {
            getNumInvitesPerDateOfUser(dateStart: "${reportStartDate}", dateEnd: "${reportEndDate}", email: "${email}") {
                visitorEmail,
                visitorName,
                inviteDate,
                inviteState,
                signInTime,
                signOutTime
            }
        }
    `);

    const getTotalNumberOfInvites = useQuery(gql`
        query {
            getTotalNumberOfInvitesOfResident(email: "${email}")
        }
    `);

    useEffect(() => {
        if (!loading && !error) {
            const invites = data.getNumInvitesPerDateOfUser;
            invites.forEach((invite) => {
                dateMap.set(
                    invite.inviteDate,
                    dateMap.get(invite.inviteDate) + 1
                );
            });

            setDateMap(new Map(dateMap));

            setVisitorVals({
                data: Array.from(dateMap.values()),
                labels: Array.from(dateMap.keys()),
                label: "Invites",
            });
        } else if (error) {
            if (error.message === "Unauthorized") {
                router.push("/expire");
            }
            console.error(error);
        }
    }, [loading, error, router, setDateMap, range]);

    useEffect(() => {
        if (
            !getTotalNumberOfInvites.loading &&
            !getTotalNumberOfInvites.error
        ) {
            setNumInvites(
                getTotalNumberOfInvites.data.getTotalNumberOfInvitesOfResident
            );
        }
    }, [getTotalNumberOfInvites]);

    useEffect(() => {
        if (
            !getInvitesForReportQuery.loading &&
            !getInvitesForReportQuery.error
        ) {
            if (getInvitesForReportQuery.data) {
                const invites =
                    getInvitesForReportQuery.data.getNumInvitesPerDateOfUser;
                console.log(invites);
                generateReport(invites);
            }
        } else if(!getInvitesForReportQuery.loading && getInvitesForReportQuery.error) {
            console.log(getInvitesForReportQuery.error);
            console.log("EEEERR");
        }
    }, [getInvitesForReportQuery]);

    return (
        <Layout>
            <div className="mb-3 mt-4 space-y-5 md:px-3">
                <div className="flex-col">
                    <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">
                        User <span className="text-primary">Analytics</span>
                    </h1>
                    <div className="breadcrumbs text-sm">
                        <ul>
                            <li>
                                <Link href="/adminDashboard">
                                    <a>Admin Dashboard</a>
                                </Link>
                            </li>
                            <li>User Analytics</li>
                        </ul>
                    </div>
                </div>

                <div className="flex w-full">
                    <div className="w-full flex-col">
                        <h2 className="flex items-center space-x-3 text-lg font-bold">
                            <div
                                className={
                                    "avatar placeholder " +
                                    (permission >= 0 ? "online" : "offline")
                                }
                            >
                                <div className="w-16 rounded-full bg-neutral-focus text-neutral-content">
                                    <span className="text-3xl font-normal">
                                        {name && name[0]}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p>
                                    {name}{" "}
                                    <span className="text-sm font-normal text-slate-400">
                                        <a
                                            target="blank"
                                            href={"mailto:" + email}
                                        >
                                            {email}
                                        </a>
                                    </span>
                                </p>
                                <p className="text-sm font-normal">
                                    {numInvites} invites in lifetime
                                </p>
                            </div>
                        </h2>
                        <div className="divider">Reports</div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <DownloadChart
                                    title={"User Invites"}
                                    filename={name + "-forecast.png"}
                                    Chart={LineChart}
                                    labelvals={visitorVals.labels}
                                    datavals={[visitorVals.data]}
                                    setStart={setStartDate}
                                    setRange={setRange}
                                    datalabels={[visitorVals.label]}
                                />
                            </div>

                            <div className="col-span-2 grid grid-cols-2 gap-4">
                                <div className="card bg-base-300">
                                    <div className="card-body">
                                        <h2 className="card-title">
                                            Generate User Activity Report
                                        </h2>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                                <p>Start Month</p>
                                                <input
                                                    type="month"
                                                    name="visitDate"
                                                    placeholder="Visit Date"
                                                    className="input input-bordered w-full"
                                                    onChange={(e) => {
                                                        setReportStartDate(
                                                            `${e.currentTarget.value}-01`
                                                        );
                                                    }}
                                                    value={reportStartDate.substr(
                                                        0,
                                                        reportStartDate.length -
                                                            3
                                                    )}
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <p>End Month</p>
                                                <input
                                                    min={
                                                        reportStartDate &&
                                                        reportStartDate.substr(
                                                            0,
                                                            reportStartDate.length -
                                                                3
                                                        )
                                                    }
                                                    type="month"
                                                    name="visitDate"
                                                    placeholder="Visit Date"
                                                    className="input input-bordered w-full"
                                                    onChange={(e) => {
                                                        setReportEndDate(
                                                            `${e.currentTarget.value}-30`
                                                        );
                                                    }}
                                                    value={reportEndDate.substr(
                                                        0,
                                                        reportEndDate.length - 3
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            className={`btn btn-primary ${
                                                generatingReport
                                                    ? "loading"
                                                    : ""
                                            }`}
                                            onClick={(e) => {
                                                setGeneratingReport(true);
                                                getInvitesForReport();
                                            }}
                                        >
                                            <HiOutlineDocumentReport className="text-xl" />
                                            PDF Report
                                        </button>
                                    </div>
                                </div>

                                {token.email !== email && (
                                    <div className="card bg-base-300">
                                        <div className="card-body">
                                            <h2 className="card-title">
                                                Manage User Account
                                            </h2>

                                            <div className="flex justify-between">
                                                <label
                                                    className="label cursor-pointer space-x-3"
                                                    onChange={() => {
                                                        setAuth(!auth);
                                                        setShowConfirm(
                                                            !showConfirm
                                                        );
                                                    }}
                                                    onClick={() =>
                                                        setAuth(!auth)
                                                    }
                                                >
                                                    <span className="label-text">
                                                        Authorize
                                                    </span>
                                                    <input
                                                        type="checkbox"
                                                        className="toggle toggle-primary"
                                                        checked={
                                                            auth ? true : false
                                                        }
                                                    />
                                                </label>

                                                {showConfirm && (
                                                    <div className="flex space-x-3">
                                                        <button
                                                            onClick={() => {
                                                                if (auth) {
                                                                    authorizeUserAccount(
                                                                        email,
                                                                        type
                                                                    );
                                                                } else {
                                                                    deauthorizeUserAccount(
                                                                        email,
                                                                        type
                                                                    );
                                                                }
                                                                setShowConfirm(
                                                                    false
                                                                );
                                                            }}
                                                            className="btn btn-primary btn-sm gap-2"
                                                        >
                                                            <BiCheckShield className="text-lg" />
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setAuth(!auth);
                                                                setShowConfirm(
                                                                    false
                                                                );
                                                            }}
                                                            className="btn btn-secondary btn-sm gap-2"
                                                        >
                                                            <BsShieldX className="text-lg" />
                                                            Decline
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                {token.email !== email && (
                                                    <label
                                                        htmlFor={
                                                            "admin-confirm-modal-" +
                                                            email
                                                        }
                                                        className="modal-button btn btn-error text-primary-content hover:btn-error"
                                                    >
                                                        <RiDeleteBin5Fill />
                                                        Delete Account
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {loading && <p>Loading</p>}
                    </div>
                </div>

                <input
                    type="checkbox"
                    id={"admin-confirm-modal-" + email}
                    className="modal-toggle"
                />
                <label
                    htmlFor={"admin-confirm-modal-" + email}
                    className="modal cursor-pointer"
                >
                    <label className="modal-box space-y-4">
                        <label
                            htmlFor={"admin-confirm-modal-" + email}
                            className="btn btn-circle btn-sm absolute right-2 top-2"
                        >
                            ✕
                        </label>
                        <h3 className="text-lg font-bold">Confirm Delete</h3>
                        <p>
                            You are about to delete account{" "}
                            <span className="text-error">{email}</span>{" "}
                            forever...
                        </p>
                        <div className="modal-action">
                            <label
                                onClick={() => {
                                    deleteUserAccount(email, type);
                                }}
                                htmlFor={"confirm-modal-" + email}
                                className="btn btn-error"
                            >
                                Delete
                            </label>
                        </div>
                    </label>
                </label>
            </div>
        </Layout>
    );
};

export async function getStaticProps(context) {
    return {
        props: {
            protected: true,
            permission: 0,
        },
    };
}

export default UserAnalytics;
