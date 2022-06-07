import { gql } from "@apollo/client";
import { GraphQLError } from "graphql";

export const validLogin = [{
        request: {
            query: gql`
                mutation {
                    login(
                       email: "admin@mail.com",
                       password: "password"
                    ) {
                        access_token
                    }
                }
            `
    },
    result: {
       data: {
        login: {
            access_token: "aswdw-wdwdwf-wdwdq12-wdwdfe-11"
        }
       } 
    }
}];

export const errorMock = [{
        request: {
            query: gql`
                mutation {
                    login(
                       email: "admin@mail.com",
                       password: "password"
                    ) {
                        access_token
                    }
                }
            `
    },
    result: {
        errors: [new GraphQLError("ERROR")],
    }
}];
