import { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

import Layout from "../components/Layout";

import { useRouter } from "next/router";

const VisitorDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [visitorData, setIsVisitorData] = useState([]);

    const router = useRouter();
    const { loading, error, data } = useQuery(gql`
        query {
            getInvites {
                idNumber
                visitorEmail
                idDocType
            }
        }
    `);

    useEffect(() => {
        if (!loading && !error) {
            setIsLoading(false);
            const invites = data.getInvites;
            setIsVisitorData(invites);
        } else if (error) {
            setIsLoading(false);

            if (error.message === "Unauthorized") {
                router.push("/expire");
                return;
            }

            setIsVisitorData([
                {
                    visitorEmail: "ERROR",
                    idDocType: "ERROR",
                    isNumber: "ERROR",
                },
            ]);
        }
    }, [loading, error, router, data]);

    return (
        <Layout>
            <h1 className="mt-5 mb-5 text-center text-4xl font-bold underline underline-offset-auto">
                Visitor History
            </h1>
            <div className="flex h-full items-center justify-center overflow-x-auto p-3">
                {isLoading ? (
                    <progress className="progress progress-primary w-56">progress</progress>
                ) : (
                    <table className="mb-5 table w-full">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Email</th>
                                <th>ID Document Type</th>
                                <th>ID Number</th>
                            </tr>
                        </thead>
                        <tbody className="relative">
                            {visitorData.length > 0 ? (
                                visitorData.map((visit, idx) => {
                                    return (
                                        <tr className="hover" key={idx}>
                                            <th>{idx + 1}</th>
                                            <td>{visit.visitorEmail}</td>
                                            <td>{visit.idDocType}</td>
                                            <td>{visit.idNumber}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <div className="absolute mt-2">
                                    <p>Nothing to show...</p>
                                </div>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </Layout>
    );
};

export async function getStaticProps(context) {
    return {
        props: {
            protected: true,
        },
    };
}

export default VisitorDashboard;
