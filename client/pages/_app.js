import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import Layout from "../components/Layout";

import useAuth from "../store/authStore";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    const access_token = useAuth((state) => state.access_token);
    const permission = useAuth((state) => state.permission)();
    const client = new ApolloClient({
        uri: process.env.BACKEND_GRAPHQL_URL,
        cache: new InMemoryCache(),
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    const isPublicPath = (url) => {
        const publicPaths = ["/login", "/", "/expire", "/signUp"];
        const path = url.split("?")[0];
        return publicPaths.includes(path);
    };

    useEffect(() => {
        if (!isPublicPath(router.asPath) && permission === -1) {
            router.push("/expire");
            return;
        }
    }, [router, permission]);

    if (
        (pageProps.protected && permission === -1) ||
        (pageProps.permission < permission && permission !== -1)
    ) {
        return <Layout> Woops: you are not supposed to be here </Layout>;
    }

    return (
        <ApolloProvider client={client}>
            <Head>
                <title>VMS</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable = no" />
            </Head>
            <Component {...pageProps} />
        </ApolloProvider>
    );
}

export default MyApp;
