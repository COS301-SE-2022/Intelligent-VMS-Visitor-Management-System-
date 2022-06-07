import { render, screen, waitFor } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks/server";
import { ApolloClient, ApolloProvider, gql, InMemoryCache, HttpLink } from "@apollo/client";
import fetch from "cross-fetch";
import "@testing-library/jest-dom";
import jwtDecode from "jwt-decode";

import CreateInvite from "../../pages/createInvite";
import useAuth from "../../store/authStore";

describe("CreateInvite", () => {

    const client = new ApolloClient({
        link: new HttpLink({ 
            uri: process.env.BACKEND_GRAPHQL_URL, fetch,
            headers: {
                Authorization: `Bearer ${process.env.RESIDENT_INVITE_TOKEN}`,
            },
        }),
        cache: new InMemoryCache(),
    });

    let numInvitesAllowed = 0;
    let numInvitesUsed = 0;
    
    beforeAll(async () => {
    });
    
    it("will prevent the user from create an invite if the max number of invites has been reached", async () => {
        const authHook = renderHook(() => useAuth());

        authHook.hydrate();

        act(() => {
            authHook.result.current.login(
                `${process.env.RESIDENT_TOKEN}`
            );
        });

        const numInvitesAllowedQuery = await client.query({
            query: gql`
                query {
                    getNumInvitesPerResident {
                        value
                    }
                }
            `
        });

        const numInvitesUsedQuery = await client.query({
            query: gql`
                query {
                    getTotalNumberOfInvitesOfResident(email: "${authHook.result.current.decodedToken.email}") 
                }
            `
        });

        numInvitesAllowed = numInvitesAllowedQuery.data.getNumInvitesPerResident.value;
        numInvitesUsed = numInvitesUsedQuery.data.getTotalNumberOfInvitesOfResident;

        console.log(numInvitesAllowed);
        console.log(numInvitesUsed);
        
        render(
            <ApolloProvider client={client}>
                <CreateInvite />
            </ApolloProvider>
        ); 
        
    }); 


});
