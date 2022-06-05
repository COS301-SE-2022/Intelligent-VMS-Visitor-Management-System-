import { useEffect, useState } from "react";
import Link from "next/link";

import Layout from "../components/Layout";

import { AiOutlineDoubleLeft } from "react-icons/ai";

const UserAnalytics = ({ propName }) => {
    const [name, setName] = useState(propName);

    useEffect(() => {
        if (name === undefined || name === "") {
            setName("Unknown");
        }
    }, [name]);

    return (
        <Layout>
            <div className="mb-3 mt-4 space-y-3 px-3">
                <div className="flex-col">
                    <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">
                        User Report For{" "}
                        <span className="text-secondary">{name}</span>
                    </h1>
                    <Link href="/adminDashboard">
                        <a className="link flex items-center font-bold normal-case">
                            <span>
                                <AiOutlineDoubleLeft />
                            </span>
                            Go Back
                        </a>
                    </Link>
                </div>

                <div>
                    <p>{name} has visited your building 10 times</p>
                </div>
            </div>
        </Layout>
    );
};

export async function getStaticProps(context) {
    return {
        props: {
            protected: true,
            permission: 0,
        },
    };
}

export default UserAnalytics;
