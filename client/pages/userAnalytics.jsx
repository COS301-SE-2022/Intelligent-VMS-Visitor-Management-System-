import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { gql, useApolloClient, useQuery } from "@apollo/client";

import { AiOutlineDoubleLeft } from "react-icons/ai";
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
    ] = useDateRange(now, 30);

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

    const deauthorizeUserAccount = (email,type) => {
        client.
            mutate({
                mutation: gql`
                    mutation {
                        deauthorizeUserAccount(email: "${email}")
                    }
                `
            }).then((res) => {
                console.log(res.data);
                if(res.data.deauthorizeUserAccount === true) {
                    console.log("DONE!");
                }
            }).catch((err) => {
            });
    };

    // Visitor invite data object for chart
    const [visitorVals, setVisitorVals] = useState({ data: [], labels: [], label: "Invites" });

    const [numInvites, setNumInvites] = useState(0);

    const [auth, setAuth] = useState(permission >= 0 ? true : false);

    const [showConfirm, setShowConfirm] = useState(false);

    const type = permission === 1 || permission === -1 
                    ? "Receptionist" : permission === 2 || permission === -2 ?
                    "Resident" : permission === 0 ? "Admin" : "Unknown";

    const { loading, error, data } = useQuery(gql`
        query {
            getNumInvitesPerDateOfUser(dateStart: "${startDate}", dateEnd: "${endDate}", email: "${email}") {
                visitorEmail,
                visitorName,
                inviteDate
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
                label: "Invites"
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

    return (
        <Layout>
            <div className="mb-3 mt-4 space-y-5 md:px-3">
                <div className="flex-col">
                    <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">
                        User Report For{" "}
                        <span className="capitalize text-secondary">
                            {name}
                        </span>
                    </h1>
                    <Link href="/adminDashboard">
                        <a className="link flex items-center font-bold normal-case">
                            <span>
                                <AiOutlineDoubleLeft />
                            </span>
                            Go Back
                        </a>
                    </Link>
                </div>

                <div className="flex">
                    <div className="card w-full bg-base-200 shadow-xl">
                        <div className="card-body flex-col">
                            <h2 className="card-title">
                                <div className="avatar placeholder">
                                    <div className="w-16 rounded-full bg-neutral-focus text-neutral-content">
                                        <span className="text-3xl font-normal">
                                            {name && name[0]}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-primary">{name}</p>
                                    <p className="text-sm font-normal">
                                        {numInvites} invites in lifetime
                                    </p>
                                </div>
                            </h2>
                            <div className="divider">Reports</div>
                            <div className="w-full h-full">
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

                            {loading && <p>Loading</p>}
                            <div className="card-actions items-center justify-start">
                                <Link
                                    href={`/viewReport?email=${email}&startDate=${startDate}&endDate=${endDate}&name=${name}&total=${numInvites}`}
                                >
                                    <a className="btn btn-primary">
                                        <HiOutlineDocumentReport className="text-xl" />
                                        PDF Report
                                    </a>
                                </Link>

                                { token.email !== email &&
                                <label
                                    htmlFor={"admin-confirm-modal-" + email}
                                    className="modal-button btn btn-error hover:btn-info"
                                >
                                    <RiDeleteBin5Fill />
                                    Delete Account
                                </label>
                                }

                                {token.email !== email && (
                                    <label
                                        className="label cursor-pointer space-x-3"
                                        onChange={() => {
                                            setAuth(!auth);
                                            setShowConfirm(!showConfirm);
                                        }}
                                        onClick={() => setAuth(!auth)}
                                    >
                                        <span className="label-text">
                                            Authorize
                                        </span>
                                        <input
                                            type="checkbox"
                                            className="toggle toggle-primary"
                                            checked={auth ? true : false}
                                        />
                                    </label>
                                )}
                    {showConfirm && (
                        <div className="justify-end space-x-3">
                            <button
                                onClick={() => {
                                    if(auth) {
                                        authorizeUserAccount(email, type);
                                    } else {
                                        console.log("UnAuth");
                                        deauthorizeUserAccount(email, type);
                                    }
                                    setShowConfirm(false);
                                }}
                                className="btn btn-primary btn-sm gap-2"
                            >
                                <BiCheckShield className="text-lg" />
                                Confirm 
                            </button>
                            <button
                                onClick={() => {
                                    setAuth(!auth);
                                    setShowConfirm(false);
                                }}
                                className="btn btn-secondary btn-sm gap-2"
                            >
                                <BsShieldX className="text-lg" />
                                Decline
                            </button>
                            </div>
                        )}
                            </div>
                        </div>
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
                        You are about to delete {" "}
                        account <span className="text-error">{email}</span>{" "}
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
