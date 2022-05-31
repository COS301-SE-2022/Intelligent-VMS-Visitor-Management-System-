import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { gql, useQuery } from "@apollo/client";

import Layout from "../components/Layout";
import AdminCard from "../components/AdminCard";
import LineChart from "../components/LineChart";
import DownloadChart from "../components/DownloadChart";

import { AiOutlinePlus, AiOutlineMinus, AiOutlineCar} from "react-icons/ai";
import { BiBuildingHouse, BiMailSend } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";

import useDateRange from "../hooks/useDateRange.hook";
import useAuth from "../store/authStore";

const AdminDashboard = () => {
    const [numInvitesSent, setNumInvitesSent] = useState(0);

    const incParkingSpots = useAuth((state) => state.incParkingSpots);
    const decParkingSpots = useAuth((state) => state.decParkingSpots);
    const updateParkingSpots = useAuth((state) => state.updateParkingSpots);

    const decodedToken = useAuth((state) => state.decodedToken)();
    const router = useRouter();
    const [visitorVals, setVisitorVals] = useState({
        data: [],
        labels: []
    });

    const [startDate, endDate, dateMap, setDateMap] = useDateRange(7);
    const [todayInvites, setTodayInvites] = useState(0);
    const [numParkingSpotsAvailable, setNumParkingSpotsAvailable] = useState(0);

    const numInvitesQuery = useQuery(gql`
        query {
            getTotalNumberOfVisitors
        }
    `);

    const numInviteInDateRangeQuery = useQuery(gql`
        query {
            getNumInvitesPerDate(
                dateStart: "${startDate}",
                dateEnd: "${endDate}"
            ) {
                inviteDate
            }
        }
    `);

    const numParkingSpotsAvailableQuery = useQuery(gql`
        query {
            getAvailableParking 
        }
    `);

    useEffect(() => {
        // Num invites
        if (!numInvitesQuery.loading && !numInvitesQuery.error) {
            const invites = numInvitesQuery.data.getTotalNumberOfVisitors;
            setNumInvitesSent(invites);
        } else if (numInvitesQuery.error) {
            if (numInvitesQuery.error.message === "Unauthorized") {
                router.push("/expire");
                return;
            }
        }

        // Num invites in range
        if (
            !numInviteInDateRangeQuery.loading &&
            !numInviteInDateRangeQuery.error
        ) {
            const invites = numInviteInDateRangeQuery.data.getNumInvitesPerDate;
            invites.forEach((invite) => {
                dateMap.set(invite.inviteDate, dateMap.get(invite.inviteDate)+1);
            });

            setDateMap(new Map(dateMap));
            setVisitorVals({
                data: Array.from(dateMap.values()),
                labels: Array.from(dateMap.keys())
            });
            
            setTodayInvites(dateMap.get(startDate));

        } else if (numInviteInDateRangeQuery.error) {
        }
        
        // Parking spots available
        if(!numParkingSpotsAvailableQuery.loading && !numParkingSpotsAvailableQuery.error) {
            const numParkingspots = numParkingSpotsAvailableQuery.data.getAvailableParking;
            setNumParkingSpotsAvailable(numParkingspots);
        } else if(numParkingSpotsAvailableQuery.error) {
        }

    }, [
        numInvitesQuery,
        numInviteInDateRangeQuery,
        numParkingSpotsAvailableQuery,
        router,
        dateMap,
        startDate,
        setNumParkingSpotsAvailable,
        setDateMap,
        setTodayInvites
    ]);

    return (
        <Layout>
            <div className="mb-3 space-y-3 px-3">
                <h1 className="mt-4 mb-4 text-left text-3xl font-bold">
                    Hello{" "}
                    <span className="text-secondary">{decodedToken.email}</span>
                </h1>
                <p className="text-tertiary prose mb-4">Welcome Back!</p>

                <div className="space-y-3 grid grid-cols-1 grid-rows-1">
                    <div className="stats shadow stats-vertical lg:stats-horizontal w-full">
                        <AdminCard description="Total Number Of Invites For Today" Icon={BiBuildingHouse} dataval={todayInvites} unit="Total"/>
                        <AdminCard description="Total Number Of Invites Sent" Icon={BiMailSend} dataval={numInvitesSent} unit="Total"/>
                        <AdminCard description="Total Number Of Parking Spots Available" Icon={AiOutlineCar} dataval={numParkingSpotsAvailable} unit="Total"/>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-secondary-content">
                        <DownloadChart title={"Visitors Forecast"} filename="visitor-forecast.png" Chart={LineChart} labelvals={visitorVals.labels} datavals={visitorVals.data}/>
                        <DownloadChart title={"Parking Forecast"} filename="visitor-forecast.png" Chart={LineChart} labelvals={visitorVals.labels} datavals={visitorVals.data}/>
                    </div>

                    <div className="w-100 text-tertiary-content card items-center justify-center space-y-2 bg-base-200 p-4 text-2xl font-bold">
                        <h1 className="text-sm md:text-xl lg:text-2xl">
                            Number of Parking Spots Available
                        </h1>
                        <div className="flex select-none space-x-4">
                            <button
                                className="btn btn-circle text-3xl"
                                onClick={incParkingSpots}
                            >
                                <AiOutlinePlus className="text-primary" />
                            </button>

                            <a
                                href="#parking-modal"
                                className="bg-tertiary modal-button btn text-3xl font-bold text-secondary md:text-4xl lg:text-5xl"
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
                                <AiOutlineMinus className="text-primary" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal" id="parking-modal">
                <div className="modal-box space-y-2">
                    <h3 className="text-md font-bold md:text-lg">
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
