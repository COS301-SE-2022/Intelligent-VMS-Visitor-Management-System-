import Layout from "../components/Layout.jsx";

const Verify = () => {
    return (
        <Layout>
            <div className="flex min-h-[80vh] items-center justify-center">
                <div className="mockup-window flex flex-col justify-center space-y-10 border bg-base-300 p-10">
                    <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">
                        Please check your email to verify your account
                    </h1>
                    <button className="btn btn-primary">Resend Email</button>
                </div>
            </div>
        </Layout>
    );
};

export default Verify;
