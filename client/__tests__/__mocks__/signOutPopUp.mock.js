import { GraphQLError } from "graphql";
import { gql } from "@apollo/client";

export const signOutMutation = [{
    request: {
        query: gql`
            mutation {
                signOut(inviteID: "1234")
            }
        `
    },
    result: {
        data: {
            signOut: 79
        }
    }
}];

export const signOutMutationError = [{
    request: {
        query: gql`
            mutation {
                signOut(inviteID: "1234")
            }
        `
    },
    result: {
        error: {
            message: "Error"
        },
    }
}];

