import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery, gql, useApolloClient } from "@apollo/client";

import Layout from "../components/Layout.jsx";
import AuthCard from "../components/AuthCard.jsx";

import useAuth from "../store/authStore";

const AuthorizeUser = () => {
    const router = useRouter();
    const token = useAuth((state) => state.decodedToken)();
    const [residentData, setResidentData] = useState([]);
    const [receptionistData, setReceptionistData] = useState([]);

    const client = useApolloClient();

    const deleteUserAccount = (email, type) => {
        client
            .mutate({
                mutation: gql`
                mutation {
                    deleteUserAccount(email: "${email}") 
                }
            `,
            })
            .then((res) => {
                if (res.data.deleteUserAccount === true) {
                    if (type === "Receptionist") {
                        setReceptionistData(
                            receptionistData.filter(
                                (data) => data.email !== email
                            )
                        );
                    } else {
                        setResidentData(
                            residentData.filter((data) => data.email !== email)
                        );
                    }
                } else {
                    console.log("ERROR!");
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const authorizeUserAccount = (email, type) => {
        client.mutate({
            mutation: gql`
                mutation {
                    authorizeUserAccount(email: "${email}")
                }
            `
        }).then((res) => {
            if(res.data.authorizeUserAccount === true) {
                if (type === "Receptionist") {
                    setReceptionistData(
                        receptionistData.filter(
                            (data) => data.email !== email
                        )
                    );
                } else {
                    setResidentData(
                        residentData.filter(
                            (data) => data.email !== email
                        )
                    );
                }
            }
        }).catch((err) => {
            console.error(err);
        });
    };

    const { loading, data, error } = useQuery(gql`
        query {
            getUnauthorizedUsers {
                email
                permission
            }
        }
    `);

    useEffect(() => {
        if (!loading && !error) {
            const userData = data.getUnauthorizedUsers;
            console.log(userData);
            const newReceptionistData = [];
            const newResidentData = [];
            userData.forEach((data) => {
                if (data.permission === -1 || data.permission === 1) {
                    newReceptionistData.push({
                        email: data.email,
                        type: "Receptionist",
                        authorized: data.permission === 1 ? true : false,
                    });
                } else {
                    newResidentData.push({
                        email: data.email,
                        type: "Resident",
                    });
                }
            });

            setReceptionistData(newReceptionistData);
            setResidentData(newResidentData);
        } else if (!loading && error) {
            console.error(error);
            if (error.message === "Unauthorized") {
                router.push("/expire");
            }
        }
    }, [loading, error, data]);

    return (
        <Layout>
            <div className="space-y-6">
                <h1 className="mt-3 text-lg font-bold md:text-xl lg:text-3xl">
                    <span className="text-secondary">Authorize</span> User
                </h1>
                {token.permission === 0 && 
                    <div className="divider text-base md:text-lg lg:text-2xl">
                        Receptionists
                    </div>
                }
                {receptionistData.length > 0 ? (
                    <div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {receptionistData.map((entry, idx) => {
                                return (
                                    <AuthCard
                                        key={idx}
                                        email={entry.email}
                                        type={entry.type}
                                        authorized={entry.authorized}
                                        authorizeUserAccount={authorizeUserAccount}
                                        deleteUserAccount={deleteUserAccount}
                                        permission={token.permission}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div>
                        {loading ? (
                            <progress className="progress progress-primary fixed left-[50%] top-[50%] w-56 translate-x-[-50%] translate-y-[-50%]">
                                Loading
                            </progress>
                        ) :
                         token.permission === 0 ? <p>Nothing to show...</p> : <></>
                        }
                    </div>
                )}

                <div className="divider text-base md:text-lg lg:text-2xl">
                    Resident
                </div>
                {residentData.length > 0 ? (
                    <div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {residentData.map((entry, idx) => {
                                return (
                                    <AuthCard
                                        key={idx}
                                        email={entry.email}
                                        type={entry.type}
                                        authorized={entry.authorized}
                                        deleteUserAccount={deleteUserAccount}
                                        authorizeUserAccount={authorizeUserAccount}
                                        permission={token.permission}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div>
                        {loading ? (
                            <progress className="progress progress-primary fixed left-[50%] top-[50%] w-56 translate-x-[-50%] translate-y-[-50%]">
                                Loading
                            </progress>
                        ) :
                        <p>Nothing to show...</p>
                        }
                    </div>
                )}
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
