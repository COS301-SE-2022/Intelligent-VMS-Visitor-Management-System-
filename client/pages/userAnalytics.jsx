import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/router';
import { gql, useQuery } from "@apollo/client";
import jsPDF from 'jspdf';
import html2canvas from "html2canvas";

import Layout from "../components/Layout";
import AdminCard from "../components/AdminCard";
import DownloadChart from "../components/DownloadChart";
import LineChart from "../components/LineChart";
import AnalyticsReport from "../components/AnalyticsReport";

import { AiOutlineDoubleLeft } from "react-icons/ai";
import { BiBuildingHouse, BiMailSend } from "react-icons/bi";

import useDateRange from "../hooks/useDateRange.hook";

const UserAnalytics = () => {
    const router = useRouter();
    const { name, email } = router.query;

    const [startDate, endDate, dateMap, setDateMap, setStartDate] = useDateRange("2022-06-01", 7);

    // Visitor invite data object for chart
    const [visitorVals, setVisitorVals] = useState({ data: [], labels: [] });
    
    const [numInvites, setNumInvites] = useState(0);

    const chartRef = useRef(null);

    const { loading, error, data } = useQuery(gql`
        query {
            getNumInvitesPerDateOfUser(dateStart: "${startDate}", dateEnd: "${endDate}", email: "${email}") {
                visitorEmail,
                visitorName,
                inviteDate
            }
        }
    `);

    useEffect(() => {
        if(!loading && !error) {
            const invites = data.getNumInvitesPerDateOfUser;
            setNumInvites(invites.length);
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
            });
        } else if(error) {
            console.error(error);
        }
    }, [loading, error]);

    return (
        <Layout>
            <div className="mb-3 mt-4 space-y-5 px-3">
                <div className="flex-col">
                    <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">
                        User Report For{" "}
                        <span className="text-secondary capitalize">{name}</span>
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

                <div className="stats stats-vertical w-full">
                    <AdminCard
                        description="Total Number of Invites Received"
                        Icon={BiBuildingHouse}
                        dataval={numInvites}
                        unit="Total"
                    />
                </div>
                <div className="flex justify-center">
                    <div className="w-1/2">
                    <DownloadChart
                        ref={chartRef}
                        title={"Visitor Weekly Visits"}
                        filename="visitor-forecast.png"
                        Chart={LineChart}
                        labelvals={visitorVals.labels}
                        datavals={visitorVals.data}
                        setStart={setStartDate}
                    />
                    </div>
                </div>
                <Link href={`/viewReport?email=${email}&startDate=${startDate}&endDate=${endDate}&name=${name}`} >
                    <a className="btn btn-primary">Generate PDF Report</a>
                </Link>
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
