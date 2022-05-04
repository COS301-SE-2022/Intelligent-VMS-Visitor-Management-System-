import { useRouter } from "next/router";
import { useEffect } from "react";

import useAuth from "../store/authStore"

import Layout from "../components/Layout";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {

    const router = useRouter();
    const access_token = useAuth((state) => state.access_token);

    const isPublicPath = (url) => {
        const publicPaths = ['/login', '/'];
        const path = url.split('?')[0];
        return publicPaths.includes(path);
    };
    
    useEffect(() => {
        if(!isPublicPath(router.asPath) && !access_token) {
            router.push("/login");
        }
    }, [])

    if(pageProps.protected && !access_token) {
        return <Layout>Unauthorized</Layout>
    }

    return <Component {...pageProps} />;
}

export default MyApp;
