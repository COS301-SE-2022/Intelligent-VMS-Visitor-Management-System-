import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery, gql, useApolloClient } from "@apollo/client";

import { FaSearch } from "react-icons/fa";

import Layout from "../components/Layout.jsx";
import AuthCard from "../components/AuthCard.jsx";
import VisitorSearchResults from "../components/VisitorSearchResults";

import useAuth from "../store/authStore";

const AuthorizeUser = () => {
    const router = useRouter();
    const token = useAuth((state) => state.decodedToken)();

    const [adminData, setAdminData] = useState([]);
    const [residentData, setResidentData] = useState([]);
    const [receptionistData, setReceptionistData] = useState([]);
    const [name, setName] = useState("");

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
        client
            .mutate({
                mutation: gql`
                mutation {
                    authorizeUserAccount(email: "${email}")
                }
            `,
            })
            .then((res) => {
                if (res.data.authorizeUserAccount === true) {
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
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const { loading, data, error } = useQuery(gql`
        query {
            getUnauthorizedUsers {
                email
                permission
                name
                idNumber
                file
            }
        }
    `);

    useEffect(() => {
        if (!loading && !error) {
            const userData = data.getUnauthorizedUsers;
            const newReceptionistData = [];
            const newResidentData = [];
            const newAdminData = [];
            userData.forEach((data) => {
                if (data.permission === -1 || data.permission === 1) {
                    newReceptionistData.push({
                        email: data.email,
                        idNumber: data.idNumber,
                        type: "Receptionist",
                        name: data.name,
                        file: data.file,
                        authorized: data.permission === 1 ? true : false,
                    });
                } else if(data.permission === -3 || data.permission === 0) {
                    newAdminData.push({
                        email: data.email,
                        type: "Admin",
                        idNumber: data.idNumber,
                        name: data.name,
                        file: data.file,
                        authorized: data.permission === 0 ? true : false,
                    });
                } else {
                    newResidentData.push({
                        email: data.email,
                        name: data.name,
                        idNumber: data.idNumber,
                        file: data.file,
                        type: "Resident",
                    });
                }
            });

            console.log(newAdminData);
            setReceptionistData(newReceptionistData);
            setResidentData(newResidentData);
            setAdminData(newAdminData);
        } else if (!loading && error) {
            if (error.message === "Unauthorized") {
                router.push("/expire");
            }
        }
    }, [loading, error, data]);

    return (
        <Layout>
            <div className="space-y-6 pl-3 mb-10">
                <div className="mt-3 flex w-full items-center justify-between">
                    <div className="w-full">
                        <h1 className="text-lg font-bold md:text-xl lg:text-3xl">
                            <span className="text-secondary">Authorize</span>{" "}
                            User
                        </h1>
                        <p>Authorize and review user accounts.</p>
                    </div>
                    {token.permission === 0 && (
                        <div className="input-group input-group-sm justify-end p-2 md:input-group-md">
                            <input
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                                type="text"
                                placeholder="Search…"
                                className="input input-bordered input-sm md:input-md"
                            />
                            <label
                                htmlFor="visitor-modal"
                                className="btn btn-square btn-sm md:btn-md"
                            >
                                <FaSearch />
                            </label>
                        </div>
                    )}
                </div>
                {token.permission === 0 && (
                    <div className="divider text-base md:text-lg lg:text-2xl">
                        Admin
                    </div>
                )}
                {adminData.length > 0 ? (
                    <div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {adminData.map((entry, idx) => {
                                return (
                                    <AuthCard
                                        key={entry.email}
                                        email={entry.email}
                                        name={entry.name}
                                        type={entry.type}
                                        idNumber={entry.idNumber}
                                        file={entry.file}
                                        authorized={entry.authorized}
                                        authorizeUserAccount={
                                            authorizeUserAccount
                                        }
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
                        ) : token.permission === 0 ? (
                            <p>Nothing to show...</p>
                        ) : (
                            <></>
                        )}
                    </div>
                )}
                {token.permission === 0 && (
                    <div className="divider text-base md:text-lg lg:text-2xl">
                        Receptionists
                    </div>
                )}
                {receptionistData.length > 0 ? (
                    <div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {receptionistData.map((entry, idx) => {
                                return (
                                    <AuthCard
                                        key={idx}
                                        email={entry.email}
                                        type={entry.type}
                                        idNumber={entry.idNumber}
                                        name={entry.name}
                                        authorized={entry.authorized}
                                        file={entry.file}
                                        authorizeUserAccount={
                                            authorizeUserAccount
                                        }
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
                        ) : token.permission === 0 ? (
                            <p>Nothing to show...</p>
                        ) : (
                            <></>
                        )}
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
                                        file={entry.file}
                                        idNumber={entry.idNumber}
                                        name={entry.name}
                                        authorized={entry.authorized}
                                        deleteUserAccount={deleteUserAccount}
                                        authorizeUserAccount={
                                            authorizeUserAccount
                                        }
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
                        ) : (
                            <p>Nothing to show...</p>
                        )}
                    </div>
                )}
            </div>

            <input
                type="checkbox"
                id="visitor-modal"
                className="modal-toggle"
                onChange={(e) => {
                    setName(e.target.value);
                }}
                value={name}
            />
            <label htmlFor="visitor-modal" className="modal cursor-pointer">
                <label className="modal-box relative" htmlFor="">
                    <VisitorSearchResults query={name} />
                </label>
            </label>
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
