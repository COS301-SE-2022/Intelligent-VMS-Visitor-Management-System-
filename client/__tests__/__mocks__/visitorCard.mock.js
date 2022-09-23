import { gql } from "@apollo/client";

export const validVerify = [{
    request: {
        query: gql`
        query {
          getMostUsedInviteData(email: "visitor@mail.com") {
            idNumber,
            visitorName,
            idDocType,
            visitorEmail
          }
        }
        `
    },
    result: {
        data: {
            getMostUsedInviteData: {
                idNumber: "",
                visitorName: "",
                idDocType: "",
                visitorEmail: ""
            }
        }
    }
}];

