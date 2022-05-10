import { useRouter } from "next/router";
import { useEffect } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import useAuth from "../store/authStore";
import Layout from "../components/Layout";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const access_token = useAuth((state) => state.access_token);
    const client = new ApolloClient({
        uri: process.env.BACKEND_GRAPHQL_URL,
        cache: new InMemoryCache(),
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    const isPublicPath = (url) => {
        const publicPaths = ["/login", "/", "/expire"];
        const path = url.split("?")[0];
        return publicPaths.includes(path);
    };

    useEffect(() => {
        if (!isPublicPath(router.asPath) && !access_token) {
            router.push("/login");
        }
    }, [router, access_token]);

    if (pageProps.protected && !access_token) {
        return <Layout>Unauthorized</Layout>;
    }

    return (
        <ApolloProvider client={client}>
            <Component {...pageProps} />
        </ApolloProvider>
    );
}

export default MyApp;
