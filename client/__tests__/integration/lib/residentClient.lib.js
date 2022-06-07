import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import fetch from "cross-fetch";

const client = new ApolloClient({
    link: new HttpLink({ 
        uri: process.env.BACKEND_GRAPHQL_URL, fetch,
        headers: {
            Authorization: `Bearer ${process.env.RESIDENT_TOKEN}`,
        },
    }),
    cache: new InMemoryCache(),
});

export default client;
