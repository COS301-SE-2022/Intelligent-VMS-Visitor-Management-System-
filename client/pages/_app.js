import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic';

import Alert from "../components/Alert";
import Layout from "../components/Layout";

import useAuth from "../store/authStore";

import "../styles/globals.css";
import "react-custom-alert/dist/index.css";

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    const options = {
      position: positions.TOP_CENTER,
      timeout: 10000,
      offset: '30px',
      transition: transitions.SCALE
    }

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
            "/resident/signUp",
            "/receptionist/signUp",
            "/signUp",
            "/verify",
            "/authorize",
            "/adminSignup",
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
            (permission === -1 || permission === -2 || permission === -3)
        ) {
            router.push("/authorize");
            return;
        }
    }, [router, permission]);

    if (pageProps.protected && (permission === -1 || permission === -2 || permission === -3)) {
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
            <AlertProvider template={Alert} {...options}>
                <Head>
                    <title>VMS</title>
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0, user-scalable = no"
                    />
                </Head>
                <Component {...pageProps} />
            </AlertProvider>
        </ApolloProvider>
    );
}

export default MyApp;
