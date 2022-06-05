import Link from "next/link";
import { useRouter } from 'next/router';

import Layout from "../components/Layout";
import AdminCard from "../components/AdminCard";

import { AiOutlineDoubleLeft } from "react-icons/ai";
import { BiBuildingHouse, BiMailSend } from "react-icons/bi";

const UserAnalytics = () => {
    const router = useRouter();
    const { name, email } = router.query;

    return (
        <Layout>
            <div className="mb-3 mt-4 space-y-5 px-3">
                <div className="flex-col">
                    <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">
                        User Report For{" "}
                        <span className="text-secondary capitalize">{name}</span>
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

                <div className="stats stats-vertical w-full">
                    <AdminCard
                        description="Total Number of Invites Received"
                        Icon={BiBuildingHouse}
                        dataval={10}
                        unit="Total"
                    />
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
