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

export const validPageLoad =[
{
    request: {
        query: gql`
            query {
                getTotalNumberOfVisitors
            }
        `
    },
    response: {
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
    response: {
        data: {
            getTotalNumberOfVisitors: 10
        }
    },
}
];
