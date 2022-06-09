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
                }
            }
        `
    },
    result: {
        data: {
            getInvitesByDate: [
                {
                    inviteID: "5e23016c-d2bf-499e-a018-6086a94df70a",
                    inviteDate: "2001-09-01",
                    idNumber: "0109235273090",
                    visitorName: "kyle",
                    inviteState: "inActive"
                }
            ]
        }
    }
}];
