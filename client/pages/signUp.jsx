import { useEffect } from "react";
import { useRouter } from "next/router";
import { gql, useQuery, useApolloClient } from "@apollo/client";
import { Field, Formik } from "formik";
import { motion } from "framer-motion";

import Layout from "../components/Layout";

import useAuth from "../store/authStore";

const SignUp = () => {
    const permission = useAuth((state) => state.permission)();
    const verify = useAuth((state) => state.setVerify);
    const verified = useAuth((state) => state.verified);

    const flyEmojiAway = {
        initial: {
            y: 0,
            x: 0,
        },
        hover: {
            y: -100,
            x: 200,
            transition: {
                ease: "linear",
                duration: 1.2,
            },
        },
    };

    const client = useApolloClient();
    const router = useRouter();

    useEffect(() => {
        if (verified && (permission === -1 || permission === -2)) {
            router.push("/verify");
        } else if (permission >= 0) {
            router.push("/");
        }
    }, [router, verified, permission]);

    return (
        <Layout>
            <div className="relative flex h-full min-h-[80vh] w-full flex-col flex-col items-center justify-center overflow-hidden">
                <ul className="steps mb-3 mt-2 text-xs md:text-base">
                    <li className="step step-primary">
                        Tell Us About Yourself
                    </li>
                    <li className="step">Verify Email</li>
                    <li className="step">Authorize Account</li>
                </ul>

                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                        confirmPassword: "",
                        apartmentNumber: "",
                        idNumber: "",
                    }}
                    validate={(values) => {
                        const errors = {};
                        if (!values.email) {
                            errors.email = "Required";
                        } else if (
                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                                values.email
                            )
                        ) {
                            errors.email = "Invalid email address";
                        } else if (!values.password) {
                            errors.password = "Required";
                        } else if (!values.confirmPassword) {
                            errors.confirmPassword = "Required";
                        } else if (
                            !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/i.test(
                                values.password
                            )
                        ) {
                            errors.password =
                                "Password needs minimum of 8 characters with one number and one special character";
                        } else if (values.confirmPassword !== values.password) {
                            errors.confirmPassword = "Passwords do not match";
                        } else if (!values.userType) {
                            errors.userType = "Please select user type";
                        }

                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        setSubmitting(false);
                        verify();
                        
                        client.mutate({
                            mutation: gql`
                                mutation {
                                    signup(email: "${values.email}", password: "${values.password}", type: "${values.userType}", idNumber: "${values.idNumber}")
                                }
                            `,
                        }).then((res) => {
                            if(res.data.signup) {
                                router.push("/verify");
                                setSubmitting(false);
                            }
                        }).catch((err) => {
                            console.error(err.message);
                        });
                        
                        setSubmitting(false);
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                    }) => (
                        <form
                            onSubmit={handleSubmit}
                            className="prose form-control space-y-4 rounded-xl border p-14"
                        >
                            <h1>Let&apos;s Get Started ✨</h1>
                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email"
                                autoComplete="username"
                                className="input input-bordered w-full"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                            ></input>
                            <span className="text-sm text-error md:text-base">
                                {errors.email && touched.email && errors.email}
                            </span>
                            <input
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                placeholder="Password"
                                className="input input-bordered w-full"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                            ></input>
                            <span className="max-w-xs text-sm text-error md:text-base">
                                {errors.password &&
                                    touched.password &&
                                    errors.password}
                            </span>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                className="input input-bordered w-full"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.confirmPassword}
                            ></input>
                            <span className="text-sm text-error md:text-base">
                                {errors.confirmPassword &&
                                    touched.confirmPassword &&
                                    errors.confirmPassword}
                            </span>
                            <p className="text-sm md:text-lg lg:text-xl">
                                I&apos;m a... <span>{values.userType}</span>
                            </p>
                            <div className="flex items-center space-x-3">
                                <label className="flex items-center space-x-3">
                                    <span className="text-sm font-bold md:text-base">
                                        Resident
                                    </span>
                                    <Field
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="radio checked:bg-primary"
                                        type="radio"
                                        name="userType"
                                        value="resident"
                                    />
                                </label>
                                <label className="flex items-center space-x-3">
                                    <span className="text-sm font-bold md:text-base">
                                        Receptionist
                                    </span>
                                    <Field
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="radio checked:bg-secondary"
                                        type="radio"
                                        name="userType"
                                        value="receptionist"
                                    />
                                </label>
                            </div>
                            <span className="text-error">
                                {errors.userType &&
                                    touched.userType &&
                                    errors.userType}
                            </span>
                            <motion.button
                                className="btn btn-primary space-x-4 overflow-y-hidden"
                                type="submit"
                                disabled={isSubmitting}
                                initial="initial"
                                whileHover="hover"
                                whileFocus="hover"
                            >
                                Let&apos;s Go{" "}
                                <motion.span
                                    className="ml-3"
                                    variants={flyEmojiAway}
                                >
                                    {" "}
                                    🚀
                                </motion.span>
                            </motion.button>
                        </form>
                    )}
                </Formik>
            </div>
        </Layout>
    );
};

export default SignUp;
