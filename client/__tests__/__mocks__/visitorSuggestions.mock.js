import { gql } from "@apollo/client";

export const getSuggestions = [{
    request: {
        query: gql`
        query {
            getSuggestions(date: "2022-09-12", userEmail: "admin@mail.com") {
                _id
                visitorName
                idNumber
                idDocType
            }
        }

        `
    },
    result: {
        data: {
            getSuggestions: [
                {
                    visitorName: "Kyle",
                    _id: "admin@mail.com",
                    idNumber: "",
                    idDocType: ""
                },
                {
                    visitorName: "Ben",
                    _id: "ben@mail.com",
                    idNumber: "",
                    idDocType: ""
                },
                {
                    visitorName: "Jim",
                    _id: "jim@mail.com",
                    idNumber: "",
                    idDocType: ""
                },
            ]
        }
    }
}];

