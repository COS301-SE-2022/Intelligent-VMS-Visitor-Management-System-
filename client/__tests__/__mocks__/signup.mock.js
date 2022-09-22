import { gql } from "@apollo/client";
import { GraphQLError } from "graphql";

export const validSignup = [{
    request: {
        query: gql`
            mutation {
                signup(
                    email: "test@mail.com", 
                    password: "password1!", 
                    type: "resident", 
                    idNumber: "0109195273070",
                    IDDocType: "RSA-ID",
                    name: "kyle"
                )

            }
        `  
    },
    result: {
        data: {
            signup: true
        }
    }
}];
