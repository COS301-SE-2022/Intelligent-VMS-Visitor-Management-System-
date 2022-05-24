import Layout from "../components/Layout.jsx";

const Verify = () => {
    return (
        <Layout>
            <div className="min-h-[80vh] flex justify-center items-center">
                <div className="mockup-window border bg-base-300 p-10 flex flex-col justify-center space-y-10">
                    <h1 className="font-bold text-xl md:text-2xl lg:text-3xl">Please check your email to verify your account</h1>
                    <button className="btn btn-primary">Resend Email</button>
                </div>
            </div>
        </Layout>
    );
};

export default Verify;
