import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { AlertContainer } from "react-custom-alert";

import Layout from "../components/Layout";

import useAuth from "../store/authStore";

import "../styles/globals.css";
import "react-custom-alert/dist/index.css";

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    const alertStyle = {
        boxShadow: "none",
        background: "hsl(var(--nc))",
        color: "white",
    };

    const access_token = useAuth((state) => {
        return state.access_token;
    });

    const permission = useAuth((state) => {
        return state.permission;
    })();

    const client = new ApolloClient({
        uri: process.env.BACKEND_GRAPHQL_URL,
        cache: new InMemoryCache(),
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    const isPublicPath = (url) => {
        const publicPaths = [
            "/login",
            "/",
            "/expire",
            "/residentSignUp",
            "/receptionistSignUp",
            "/signUp",
            "/verify",
            "/authorize",
        ];
        const path = url.split("?")[0];
        return publicPaths.includes(path);
    };

    useEffect(() => {
        if (!isPublicPath(router.asPath) && permission === -999) {
            router.push("/expire");
            return;
        } else if (
            !isPublicPath(router.asPath) &&
            (permission === -1 || permission === -2)
        ) {
            router.push("/authorize");
            return;
        }
    }, [router, permission]);

    if (pageProps.protected && (permission === -1 || permission === -2)) {
        return <Layout> Your account is not authorized yet. </Layout>;
    }

    if (
        (pageProps.protected && permission < 0) ||
        (pageProps.permission < permission && permission !== -999)
    ) {
        return <Layout> Woops: you are not supposed to be here </Layout>;
    }

    return (
        <ApolloProvider client={client}>
            <Head>
                <title>VMS</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, user-scalable = no"
                />
            </Head>
            <Component {...pageProps} />
            <AlertContainer floatingTime={5000} alertStyle={alertStyle} />
        </ApolloProvider>
    );
}

export default MyApp;
