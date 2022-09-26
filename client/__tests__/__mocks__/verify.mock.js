import { gql } from "@apollo/client";

export const validVerify = [{
    request: {
        query: gql`
            mutation {
                verify(verifyID: "4e036ea3-40ec-4622-8317-cb5898f58fdd", email: "admin@mail.com") 
            }
        `
    },
    result: {
    }
}];

export const resendEmail = [{
    request: {
        query: gql`
            query {
                resendEmail(email: "admin@mail.com")
            }
        `
    },
    result: {
    }
}];
