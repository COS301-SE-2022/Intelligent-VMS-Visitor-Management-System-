import Layout from "../components/Layout";

import useAuth from "../store/authStore";

const Expire = () => {
    const logout = useAuth((state) => {
        return state.logout;
    });
    logout();

    return (
        <Layout>
            <div className="mt-10 flex min-h-[70vh] items-center justify-center">
                <div className="mockup-window border bg-base-300">
                    <div className="flex flex-col justify-center bg-base-200 px-16 py-16 text-center">
                        <h3 className="text-2xl font-bold">
                            Woops: you are unauthorized
                        </h3>
                        <p>Please login again.</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Expire;
