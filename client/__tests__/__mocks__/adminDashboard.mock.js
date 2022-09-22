import { gql } from "@apollo/client";
import { GraphQLError } from "graphql";

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

const today = new Date();
const startDate = getFormattedDateString(today);
const endDate = getFormattedDateString(today.getDate() + 7);

export const validPageLoad =[
{
    request: {
        query: gql`
            query {
                getTotalNumberOfVisitors
            }
        `
    },
    result: {
        data: {
            getTotalNumberOfVisitors: 10
        }
    },
},
{
    request: {
        query: gql`
            query {
                getTotalAvailableParking
            }
        `
    },
    result: {
        data: {
            getTotalNumberOfVisitors: 10
        }
    },
},
{
    request: {
        query: gql`
        query {
            getNumInvitesPerDate(
                dateStart: "${startDate}",
                dateEnd: "${endDate}"
            ) {
                inviteDate
                inviteState
            }
        }
        `
    },
    result: {
        data: {
            getNumInvitesPerDate: [
                {
                    inviteDate: "2022-09-12",
                    inviteState: "state"
                },
                {
                    inviteDate: "2022-09-12",
                    inviteState: "state"
                },
                {
                    inviteDate: "2022-09-12",
                    inviteState: "state"
                },
                {
                    inviteDate: "2022-09-12",
                    inviteState: "state"
                },
                {
                    inviteDate: "2022-09-12",
                    inviteState: "state"
                },
                {
                    inviteDate: "2022-09-12",
                    inviteState: "state"
                },
                {
                    inviteDate: "2022-09-12",
                    inviteState: "state"
                },
            ]
        }
    }
},
{
    request: {
        query: gql`
        query {
            getUsedParkingsInRange(startDate: "${startDate}", endDate: "${endDate}") {
                reservationDate
            }
        }
        `
    },
    result: {
        data: {
            getUsedParkingsInRange: [
                {reservationDate: "2022-09-12"},
                {reservationDate: "2022-09-12"},
                {reservationDate: "2022-09-12"},
                {reservationDate: "2022-09-12"},
                {reservationDate: "2022-09-12"},
                {reservationDate: "2022-09-12"},
                {reservationDate: "2022-09-12"},
                {reservationDate: "2022-09-12"},
                {reservationDate: "2022-09-12"},
            ]
        }
    }
},
{
    request: {
        query: gql`
        query {
          getPredictedInviteData(startDate: "${startDate}", endDate: "${endDate}") {
            date
            parking,
            visitors
          }
        }
        `
    },
    result: {
        data: {
            getPredictedInviteData: [
                {
                    date: "2022-09-12",
                    parking: 90,
                    visitors: 120
                },
                {
                    date: "2022-09-12",
                    parking: 90,
                    visitors: 120
                },
                {
                    date: "2022-09-12",
                    parking: 90,
                    visitors: 120
                },
                {
                    date: "2022-09-12",
                    parking: 90,
                    visitors: 120
                },
                {
                    date: "2022-09-12",
                    parking: 90,
                    visitors: 120
                },
                {
                    date: "2022-09-12",
                    parking: 90,
                    visitors: 120
                },
                {
                    date: "2022-09-12",
                    parking: 90,
                    visitors: 120
                },
                {
                    date: "2022-09-12",
                    parking: 90,
                    visitors: 120
                },
            ]
        }
    }
},
{
    request: {
        query: gql`
        query {
            getNumInvitesPerResident {
                value
            }
        }
        `
    },
    result: {
        data: {
            getNumInvitesPerResident: {
                value: 4
            }
        }
    }
},
{
    request: {
        query: gql`
        query {
            getCurfewTime {
                value
            }
        }
        `
    },
    result: {
        data: {
            getCurfewTime: {
                value: 1200
            }
        }
    }
}
];
