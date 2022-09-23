import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";

import Layout from "../components/Layout";
import DownloadChart from "../components/DownloadChart";
import LineChart from "../components/LineChart";
import PieChart from "../components/PieChart";
import TeamCarousel from "../components/TeamCarousel";

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

const getEndDate = (start, range) => {
    const startDate = new Date(start);
    const endDate = new Date(start);
    endDate.setFullYear(startDate.getFullYear());
    endDate.setMonth(startDate.getMonth());
    endDate.setDate(startDate.getDate() + range);
    return endDate;
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const Reporting = () => {
    const router = useRouter();
    const now = new Date();
    const [startDate, setStartDate] = useState(new Date());
    const [range, setRange] = useState(6);
    const [endDate, setEndDate] = useState(getEndDate(startDate, range));
    const [visitorData, setVisitorData] = useState({ data: [], labels: [] });
    const [inviteData, setInviteData] = useState({ data: [], labels: [] });
    const [cancelData, setCancelData] = useState({ data: [], labels: [] });
    const [predictedData, setPredictedData] = useState({ data: [], labels: [], });
    const [receptionistInvites, setReceptionistInvites] = useState([]);
    const [activity, setActivity] = useState([]);

    const { loading, error, data } = useQuery(
        gql`
            query {
                getNumInvitesPerDate(
                    dateStart: "${getFormattedDateString(startDate)}",
                    dateEnd: "${getFormattedDateString(endDate)}"
                ) {
                    inviteDate
                    inviteState
                }
            }
        `
    );

    const predictedInvitesQuery = useQuery(gql`
        query {
          getPredictedInviteData(startDate: "${getFormattedDateString(startDate)}", endDate: "${getFormattedDateString(endDate)}") {
            date,
            parking,
            visitors
          }
        }
    `);

    const receptionistInviteQuery = useQuery(
        gql`
            query {
                getInvitesForUserType(permission: 1) {
                    _id
                    numInvites
                    numVisitors
                    firstDate
                }
            }
        `
    );

    useEffect(() => {
        if (
            !receptionistInviteQuery.loading &&
            !receptionistInviteQuery.error &&
            receptionistInviteQuery.data
        ) {
            const receptionists = [];
            receptionistInviteQuery.data.getInvitesForUserType.forEach(
                (groupData) => {
                    receptionists.push({
                        email: groupData._id,
                        numInvites: groupData.numInvites,
                        numVisitors: groupData.numVisitors,
                        firstDate: groupData.firstDate,
                    });
                }
            );

            setReceptionistInvites(receptionists);
        } else if (receptionistInviteQuery.error) {
        }
    }, [receptionistInviteQuery]);

    useEffect(() => {
        if (!loading && !error && data) {
            let invites = [...data.getNumInvitesPerDate];

            const _inviteDateMap = new Map();
            const _visitorDateMap = new Map();
            const _cancelMap = new Map();
            const _activity = new Map();

            for (let i = 0; i < range; i++) {
                const dateKey = new Date(startDate);
                dateKey.setDate(startDate.getDate() + i);
                _inviteDateMap.set(getFormattedDateString(dateKey), 0);
                _visitorDateMap.set(getFormattedDateString(dateKey), 0);
                _cancelMap.set(getFormattedDateString(dateKey), 0);
            }

            let endActivity = new Date();
            for(let i = 0; i < 5; i++) {
                const dateKey = new Date(startDate);
                dateKey.setDate(startDate.getDate() + i);
                _activity.set(getFormattedDateString(dateKey), 0);
                if(i === 4) {
                    endActivity = dateKey;
                }
            }

            invites.forEach((invite, idx) => {
                if (invite.inviteState === "inActive") {
                    _inviteDateMap.set(
                        invite.inviteDate,
                        _inviteDateMap.get(invite.inviteDate)
                            ? _inviteDateMap.get(invite.inviteDate) + 1
                            : 1
                    );
                } else if (
                    (invite.inviteState === "signedIn" ||
                        invite.inviteState === "signedOut") &&
                    new Date(invite.inviteDate) <= now
                ) {
                    _visitorDateMap.set(
                        invite.inviteDate,
                        _visitorDateMap.get(invite.inviteDate)
                            ? _visitorDateMap.get(invite.inviteDate) + 1
                            : 1
                    );

                    _inviteDateMap.set(
                        invite.inviteDate,
                        _inviteDateMap.get(invite.inviteDate)
                            ? _inviteDateMap.get(invite.inviteDate) + 1
                            : 1
                    );

                    if(new Date(invite.inviteDate) <= endActivity) {
                        _activity.set(
                            invite.inviteDate,
                            _activity.get(invite.inviteDate)
                                ? _activity.get(invite.inviteDate) + 1
                                : 1
                        );
                    }
                } else if (invite.inviteState === "cancelled") {
                    _cancelMap.set(
                        invite.inviteDate,
                        _cancelMap.get(invite.inviteDate)
                            ? _cancelMap.get(invite.inviteDate) + 1
                            : 1
                    );
                }
            });
            
            console.log(Array.from(_inviteDateMap.values()).length);

            setActivity(Array.from(_activity.keys()).map((data) => {
                return  {date: data, visitors: _activity.get(data)};
            }));
            
            setInviteData({
                data: Array.from(_inviteDateMap.values()),
                labels: Array.from(_inviteDateMap.keys()),
            });

            setVisitorData({
                data: Array.from(_visitorDateMap.values()),
                labels: Array.from(_visitorDateMap.keys()),
            });

            setCancelData({
                data: Array.from(_cancelMap.values()),
                labels: Array.from(_cancelMap.keys()),
            });
        } else if (error) {
            if (error.message === "Unauthorized") {
                router.push("/expire");
            }
        }
    }, [loading, data, error, range, startDate]);

    useEffect(() => {
        setEndDate(getEndDate(startDate, range));
    }, [startDate, range]);

    useEffect(() => {
        if (!predictedInvitesQuery.loading && !predictedInvitesQuery.error) {
            const _predictedMap = new Map();

            for (let i = 0; i < range; i++) {
                const dateKey = new Date(startDate);
                dateKey.setDate(startDate.getDate() + i);
                _predictedMap.set(getFormattedDateString(dateKey), 0);
            }

            const predictedData =
                predictedInvitesQuery.data.getPredictedInviteData;

            predictedData.forEach((prediction) => {
                _predictedMap.set(prediction.date, prediction.visitors);
            });

            setPredictedData({
                data: Array.from(_predictedMap.values()),
                labels: Array.from(_predictedMap.keys()),
            });
        } else if (predictedInvitesQuery.error) {
        }
    }, [predictedInvitesQuery]);

    const sum = (data) => {
        let sum = 0;
        data.forEach((val) => {
            sum += val;
        });
        return sum;
    };

    return (
        <Layout>
            <h1 className="p-3 text-4xl font-bold text-primary">Reporting</h1>
            <div className="mb-3 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="card col-span-2 bg-base-300">
                    <div className="card-body">
                        <h2 className="card-title">Net Visitors</h2>
                        <DownloadChart
                            Chart={LineChart}
                            labelvals={inviteData.labels}
                            datavals={[
                                inviteData.data,
                                visitorData.data,
                                predictedData.data,
                            ]}
                            datalabels={[
                                "Invites",
                                "Visitors",
                                "Predicted Visitors",
                            ]}
                            setStart={setStartDate}
                            setRange={setRange}
                            queryLoading={loading}
                        />
                    </div>
                </div>

                <div className="card col-span-2 bg-base-200 p-1 md:p-3 lg:col-span-1 lg:p-5">
                    <h2 className="card-title">
                        Invites vs Visitors vs Cancellations
                    </h2>
                    <div className="card-body">
                        <PieChart
                            labelvals={["Invites", "Visitors", "Cancellations"]}
                            datavals={[
                                sum(inviteData.data),
                                sum(visitorData.data),
                                sum(cancelData.data),
                            ]}
                            datalabels={["Invites"]}
                        />
                        <div>
                            <div className="divider"></div>
                            <p>
                                For {getFormattedDateString(startDate)} to{" "}
                                {getFormattedDateString(endDate)} we had{" "}
                                {sum(inviteData.data)} invites sent but not
                                used.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="card col-span-2 bg-base-200 p-3 lg:col-span-1">
                    <h2 className="card-title p-3">Traffic</h2>
                    <div className="card-body w-full">
                        {activity.length === 0 ? <div>Nothing to show...</div>
                            : activity.map((row,idx) => {
                                const date = new Date(row.date);
                                return (
                                    <div key={idx} className="flex flex-col w-full">
                                        <div className="flex justify-between w-full">
                                            <p>{date.getDate() + "-" + monthNames[date.getMonth()]}</p>
                                            <p>{row.visitors} visitors</p>
                                        </div>
                                        <div className="divider"></div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                <div className="card col-span-2 bg-base-300 p-3 lg:col-span-2">
                    <h2 className="card-title p-3">Team Usage</h2>
                    <div className="card-body relative w-full">
                        <TeamCarousel
                            slideContent={receptionistInvites}
                            numToShowPerSlide={2}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Reporting;
