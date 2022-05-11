import Layout from "../components/Layout";
import { AiFillEye } from 'react-icons/ai';

import useAuth from "../store/authStore";

const AdminDashboard = () => {
    const decodedToken = useAuth((state) => state.decodedToken)();

    return (
        <Layout>
            <div className="px-3">
                <h1 className="mt-4 mb-4 text-left text-3xl font-bold">
                    Hello {decodedToken.email}
                </h1>
                <p className="prose mb-4 text-tertiary">Welcome Back!</p>

                <div>
                    <div className="card w-100 h-70 bg-base-300 text-tertiary-content">
                      <div className="card-body">
                            <div className="grid gap-4 grid-cols-3 grid-rows-1 place-center">
                                <div className="card flex flex-col space-y-5 justify-center items-center">
                                    <div className="avatar">
                                      <div className="w-14 rounded-full bg-neutral-focus flex items-center justify-center">
                                        <AiFillEye className="text-primary" size="lg"/>
                                      </div>
                                    </div>
                                    <p className="text-sm">Number Of Visitors</p>
                                    <p className="font-bold text-5xl text-secondary">
                                        <span>500</span>
                                    </p>
                                    <p>Total Visitors</p>
                                </div>

                                <div className="card flex flex-col space-y-5 justify-center items-center">
                                    <div className="avatar">
                                      <div className="w-14 rounded-full bg-neutral-focus flex items-center justify-center">
                                        <AiFillEye className="text-primary" size="lg"/>
                                      </div>
                                    </div>
                                    <p className="text-sm">Other Data</p>
                                    <p className="font-bold text-5xl text-secondary">
                                        <span>500</span>
                                    </p>
                                    <p>Amount</p>
                                </div>

                                <div className="card flex flex-col space-y-5 justify-center items-center">
                                    <div className="avatar">
                                      <div className="w-14 rounded-full bg-neutral-focus flex items-center justify-center">
                                        <AiFillEye className="text-primary" size="lg"/>
                                      </div>
                                    </div>
                                    <p className="text-sm">Other Data</p>
                                    <p className="font-bold text-5xl text-secondary">
                                        <span>500</span>
                                    </p>
                                    <p>Amount</p>
                                </div>
                            </div>
                        </div>
                    </div>
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

export default AdminDashboard;
