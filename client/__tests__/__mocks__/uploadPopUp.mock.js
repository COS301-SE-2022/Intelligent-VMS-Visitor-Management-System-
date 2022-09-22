import { gql } from "@apollo/client";

export const bulkSignInMutation = [{
    request: {
        query: gql`
        mutation {
            bulkSignIn(
                file: "${encodeURI("hello")}", 
                userEmail: "admin@mail.com"
                ){
                        signInCount,
                        createCount
                }
        }
        `
    },
    result: {
        data: {
            bulkSignIn: {
                signInCount: 3,
                createCount: 1
            }
        }
    }
}];

