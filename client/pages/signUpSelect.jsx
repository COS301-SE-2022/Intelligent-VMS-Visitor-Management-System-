import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { gql, useQuery, useApolloClient } from "@apollo/client";
import { Field, Formik } from "formik";
import { motion } from "framer-motion";

import Layout from "../components/Layout";
import ErrorAlert from "../components/ErrorAlert";

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



    const client = useApolloClient();
    const router = useRouter();

    const navigateToResidentSignup = () => {
        router.push("/residentSignUp");
      };
    const navigateToReceptionistSignup = () => {
        router.push("/verify");
      };


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
                                    <button onClick={navigateToResidentSignup}> <span className="text-sm font-bold md:text-base">Resident</span></button>
                                </div>
                                <div>
                                    <button onClick={navigateToReceptionistSignup}><span className="text-sm font-bold md:text-base">Receptionist</span></button>
                                </div>
                                
                                
                            </form>
                        
                    
                
                
            </div>
        </Layout>
        
    );
};//<button onClick={navigateToverify}>Verify</button>

export default SignUpSelect;
