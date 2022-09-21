import { gql } from "@apollo/client";
import { GraphQLError } from "graphql";

export const validSignup = [{
    request: {
        query: gql`
            mutation {
                signup(email: "test@mail.com", password: "password1!",confirmationPin:"11111", type: "resident", idNumber: "1")
            }
        `  
    },
    result: {
        data: {
            signup: true
        }
    }
}];
