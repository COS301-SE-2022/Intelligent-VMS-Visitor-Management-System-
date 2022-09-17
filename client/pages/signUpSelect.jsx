import { useState } from "react";
import { useRouter } from "next/router";
import { useApolloClient } from "@apollo/client";


import Layout from "../components/Layout";
import useAuth from "../store/authStore";

const SignUpSelect = () => {
    const permission = useAuth((state) => {
        return state.permission;
    })();
    const verify = useAuth((state) => {
        return state.setVerify;
    });
    const verified = useAuth((state) => {
        return state.verified;
    });

    const [error, setError] = useState({
        message: "Error",
        showCondition: false,
    });

    return (
        <Layout>
            <div className="relative mb-4 flex h-full min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden">
                            <form
                            
                                className="prose form-control space-y-4 rounded-xl border p-14"
                            >
                                <h1>What type of account would you like to sign up for? </h1>
        
                                <p className="text-sm md:text-lg lg:text-xl">
                                    I&apos;m a... <span></span>
                                </p>

                                <div className="flex items-center space-x-3">
                                    <a href={"/residentSignUp"}> <span className="text-sm font-bold md:text-base">Resident</span></a>
                                </div>

                                <div>
                                    <a href={"/receptionistSignUp"}><span className="text-sm font-bold md:text-base">Receptionist</span></a>
                                </div> 
                            </form>
            </div>
        </Layout>
        
    );
};

export default SignUpSelect;
