import { gql } from "@apollo/client";

export const bulkSignInMutation = [{
    request: {
        query: gql`
        mutation {
            bulkSignIn(
                file: "${encodeURI("hello")}", 
                userEmail: "admin@mail.com"
                ){
                        signInData,
                        createData
                }
        }
        `
    },
    result: {
        data: {
            bulkSignIn: {
                signInCount: [],
                createCount: []
            }
        }
    }
}];

