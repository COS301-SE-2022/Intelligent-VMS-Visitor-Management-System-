import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";

import Layout from "../components/Layout.jsx";
import AuthCard from "../components/AuthCard.jsx";

import useAuth from "../store/authStore";

const AuthorizeUser = () => {
    const token = useAuth((state) => state.decodedToken)();

    const { loading, data, error } = useQuery(gql`
        query {
            getUnauthorizedUsers {
                email,
                permission
            }
        }
    `);

    useEffect(() => {
        if(!loading && !error) {
            console.log(data.getUnauthorizedUsers);
        } else if(!loading && error){
            console.error(error);
        }
    }, [loading,error]);

    return (
        <Layout>
            <div className="space-y-6">
                <h1 className="mt-3 text-lg font-bold md:text-xl lg:text-3xl">
                    <span className="text-secondary">Authorize</span> User
                </h1>
                <div className="divider text-base md:text-lg lg:text-2xl">Receptionists</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AuthCard email="email@mail.com" type="Receptionist"/>
                    <AuthCard email="email@mail.com" type="Receptionist"/>
                    <AuthCard email="email@mail.com" authorized type="Receptionist"/>
                </div>
                <div className="divider text-base md:text-lg lg:text-2xl">Resident</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AuthCard email="email@mail.com" type="Resident"/>
                    <AuthCard email="skorpion19091@gmail.com" type="Resident"/>
                    <AuthCard email="email@mail.com" authorized type="Resident"/>
                    <AuthCard email="email@mail.com" authorized type="Resident"/>
                </div>
            </div>
        </Layout>
    );
};

export async function getStaticProps(context) {
    return {
        props: {
            protected: true,
            permission: 1,
        },
    };
}

export default AuthorizeUser;
