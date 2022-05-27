import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { gql, useQuery, useApolloClient } from "@apollo/client";

import Layout from "../components/Layout";

import { AiFillEye, AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { BsFillHouseDoorFill } from "react-icons/bs";

import useAuth from "../store/authStore";

const getFormattedDateString = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return [date.getFullYear(), (month > 9 ? "" : "0") + month, (day > 9 ? "" : "0") + day].join("-");
};

const AdminDashboard = () => {
    const [numInvitesSent, setNumInvitesSent] = useState(0);
    const numParkingSpotsAvailable = useAuth((state) => state.numParkingSpots);
    const incParkingSpots = useAuth((state) => state.incParkingSpots);
    const decParkingSpots = useAuth((state) => state.decParkingSpots);
    const updateParkingSpots = useAuth((state) => state.updateParkingSpots);
    const decodedToken = useAuth((state) => state.decodedToken)();
    const router = useRouter();
    const startDate = new Date(Date.now());
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 9);

    const numInvitesQuery = useQuery(gql`
        query {
            getTotalNumberOfVisitors
        }
    `);

    const numInviteInDateRangeQuery = useQuery(gql`
        query {
            getNumInvitesPerDate(
                dateStart: "${getFormattedDateString(startDate)}",
                dateEnd: "${getFormattedDateString(endDate)}"
            ) {
                inviteDate
            }
        }
    `);

    useEffect(() => {
        if (!numInvitesQuery.loading && !numInvitesQuery.error) {
            const invites = numInvitesQuery.data.getTotalNumberOfVisitors;
            setNumInvitesSent(invites);
        } else if (numInvitesQuery.error) {
            if (error.message === "Unauthorized") {
                router.push("/expire");
                return;
            }
        }

        if(!numInviteInDateRangeQuery.loading && !numInviteInDateRangeQuery.error) {
            console.log(getFormattedDateString(startDate), getFormattedDateString(endDate));
            const invites = numInviteInDateRangeQuery.data.getNumInvitesPerDate;
            console.log(invites);
        } else if(numInviteInDateRangeQuery.error) {
            if (numInviteInDateRangeQuery.error.message === "Unauthorized") {
                router.push("/expire");
                return;
            }
            console.log(numInviteInDateRangeQuery.error);
        }

    }, [numInvitesQuery, numInviteInDateRangeQuery, router]);

    return (
        <Layout>
            <div className="px-3 space-y-3 mb-3">
                <h1 className="mt-4 mb-4 text-left text-3xl font-bold">
                    Hello{" "}
                    <span className="text-secondary">{decodedToken.email}</span>
                </h1>
                <p className="text-tertiary prose mb-4">Welcome Back!</p>

                <div className="space-y-3">
                    <div className="w-100 h-70 text-tertiary-content card bg-base-300">
                        <div className="card-body">
                            <div className="place-center grid grid-cols-1 md:grid-cols-3 grid-rows-1 gap-4">
                                <div className="card flex flex-col items-center justify-center space-y-5">
                                    <div className="avatar">
                                        <button className="btn btn-disabled btn-circle bg-base-100 text-3xl flex items-center">
                                            <BsFillHouseDoorFill
                                                className="text-primary"
                                            />
                                        </button>
                                    </div>
                                    <p className="text-xs md:text-sm">
                                        Total Number Of Invites Sent
                                    </p>
                                    <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary">
                                        <span>{numInvitesSent}</span>
                                    </p>
                                    <p className="text-xs md:text-sm">Total</p>
                                </div>

                                <div className="card flex flex-col items-center justify-center space-y-5">
                                    <div className="avatar">
                                        <button className="btn btn-disabled btn-circle bg-base-100 text-3xl">
                                            <AiFillEye
                                                className="text-primary"
                                            />
                                        </button>
                                    </div>
                                    <p className="text-xs md:text-sm">Other Data</p>
                                    <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary">
                                        <span>{120}</span>
                                    </p>
                                    <p className="text-xs md:text-sm">Amount</p>
                                </div>

                                <div className="card flex flex-col items-center justify-center space-y-5">
                                    <div className="avatar">
                                        <button className="btn btn-disabled btn-circle bg-base-100 p-2 text-3xl">
                                            <AiFillEye
                                                className="text-primary"
                                            />
                                        </button>
                                    </div>
                                    <p className="text-xs md:text-sm">Other Data</p>
                                    <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary">
                                        <span>{9102}</span>
                                    </p>
                                    <p className="text-xs md:text-sm">Amount</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-100 text-tertiary-content card items-center justify-center space-y-2 bg-base-200 p-4 text-2xl font-bold">
                        <h1 className="text-sm md:text-xl lg:text-2xl">Number of Parking Spots Available</h1>
                        <div className="flex select-none space-x-4">
                            <button
                                className="btn btn-circle text-3xl"
                                onClick={incParkingSpots}
                            >
                                <AiOutlinePlus
                                    className="text-primary"
                                />
                            </button>

                            <a
                                href="#parking-modal"
                            className="bg-tertiary modal-button btn text-3xl md:text-4xl lg:text-5xl font-bold text-secondary"
                            >
                                {numParkingSpotsAvailable}
                            </a>

                            <button
                                className="btn btn-circle text-3xl"
                                onClick={() =>
                                    numParkingSpotsAvailable > 0 &&
                                    decParkingSpots()
                                }
                            >
                                <AiOutlineMinus
                                    className="text-primary"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal" id="parking-modal">
                <div className="modal-box space-y-2">
                    <h3 className="text-md md:text-lg font-bold">
                        Update Number of Parking Spots Available
                    </h3>
                    <input
                        onChange={(e) =>
                            updateParkingSpots(Number(e.target.value))
                        }
                        className="input input-bordered w-full max-w-xs"
                        type="number"
                        placeholder={numParkingSpotsAvailable}
                    />
                    <div className="modal-action">
                        <a href="#" className="btn">
                            Update
                        </a>
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
            permission: 0,
        },
    };
}

export default AdminDashboard;
