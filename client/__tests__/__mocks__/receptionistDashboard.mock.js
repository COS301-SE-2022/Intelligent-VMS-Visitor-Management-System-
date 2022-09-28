import { gql } from "@apollo/client";

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

export const todayInvites = [{
    request: {
        query: gql`
        query {
            getInvitesByDate( date: "${getFormattedDateString(new Date())}" ) {
                inviteID
                inviteDate
                idNumber
                visitorName
                inviteState
                idDocType
                userEmail
                signInTime
            }
        }

        `
    },
    result: {
        data: {
            getInvitesByDate: [
                {
                    inviteID: "5e23016c-d2bf-499e-a018-6086a94df70a",
                    inviteDate: getFormattedDateString(new Date()),
                    idNumber: "0109235273090",
                    visitorName: "kyle",
                    inviteState: "inActive",
                    idDocType: "RSA-ID",
                    userEmail: "admin@mail.com",
                }
            ]
        }
    }
}];

export const todayInvitesAndSearch = [{
    request: {
        query: gql`
        query {
            getInvitesByDate( date: "${getFormattedDateString(new Date())}" ) {
                inviteID
                inviteDate
                idNumber
                visitorName
                inviteState
                idDocType
                userEmail
                signInTime
            }
        }

        `
    },
    result: {
        data: {
            getInvitesByDate: [
                {
                    inviteID: "5e23016c-d2bf-499e-a018-6086a94df70a",
                    inviteDate: getFormattedDateString(new Date()),
                    idNumber: "0109235273090",
                    visitorName: "kyle",
                    inviteState: "inActive",
                    idDocType: "RSA-ID",
                    userEmail: "admin@mail.com",
                }
            ]
        }
    }
},
{
    request: {
        query: gql`
            query{
                    getInvitesByNameForSearch( name: "kyle") {
                        inviteID
                        inviteDate
                        idNumber
                        visitorName
                        inviteState
                        idDocType
                        userEmail
                    }
                }
        `
    },
    result: {
        data: {
            getInvitesByNameForSearch: [
                {
                    inviteID: "5e23016c-d2bf-499e-a018-6086a94df70a",
                    inviteDate: getFormattedDateString(new Date()),
                    idNumber: "0109235273090",
                    visitorName: "kyle",
                    inviteState: "inActive",
                    idDocType: "RSA-ID",
                    userEmail: "admin@mail.com",
                }
            ]
        }
    }
},
];
