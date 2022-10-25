import { useRouter } from "next/router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Formik } from "formik";
import { gql, useMutation } from "@apollo/client";
import { useAlert } from 'react-alert';

import { AiOutlineKey, AiFillLock } from "react-icons/ai";

import useAuth from "../store/authStore";

import Layout from "../components/Layout";
import useTheme from "../store/themeStore";

const Login = () => {
    const alert = useAlert();

    const login = useAuth((state) => {
        return state.login;
    });
    const logout = useAuth((state) => {
        return state.logout;
    });
    const verify = useAuth((state) => {
        return state.setVerify;
    });
    const decodedToken = useAuth((state) => {
        return state.decodedToken;
    });
    const addTheme = useTheme((state) => {
        return state.addTheme;
    });
    const router = useRouter();

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loginMutation, { data, loading, error }] = useMutation(gql`
        mutation {
			login(email: "${undefined}", password: "${undefined}") {
				access_token
			}
        }
    `);

    const spinArrow = {
        initial: {
            opacity: 0,
            transition: {
                ease: "easeInOut",
                duration: 0.5,
            },
        },
        hover: {
            opacity: 1,
            rotate: [0, 225],
            translateX: [0, 15],
            transition: {
                ease: "easeInOut",
                duration: 1,
            },
        },
    };

    const slideLock = {
        initial: {
            opacity: 0,
            transition: {
                ease: "easeInOut",
            },
        },
        hover: {
            opacity: 1,
            x: [100, 0],
            transition: {
                ease: "easeInOut",
                duration: 1.2,
            },
        },
    };

    return (
        <Layout>
            <div className="relative flex h-full min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden pb-3">
                <Formik
                    initialValues={{ email: "", password: "" }}
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
                        }
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        loginMutation({
                            mutation: gql`
                                    mutation {
                                        login(email: "${values.email}", password: "${values.password}") {
                                            access_token
                                        }
                                    }`,
                        })
                            .then((res) => {
                                // Enable button
                                setSubmitting(false);

                                // Remove alerts if any
                                setShowErrorAlert(false);

                                // Get token from response
                                const token = res.data.login.access_token;

                                // Remove old login data
                                logout();

                                // Mark the user as verified
                                verify();

                                // Add token to store
                                login(token);

                                addTheme();

                                const permission = decodedToken().permission;

                                if (permission === 2) {
                                    router.push("/createInvite");
                                } else if (permission === 1) {
                                    router.push("/receptionistDashboard");
                                } else if (permission === 0) {
                                    router.push("/adminDashboard");
                                } else {
                                    router.push("/authorize");
                                }
                            })
                            .catch((err) => {
                                setSubmitting(false);
                                alert.show(String(err.message), {
                                    type: "error"
                                });
                            });
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
                    }) => {
                        return (
                            <form
                                onSubmit={handleSubmit}
                                className="prose form-control mt-5 space-y-4 rounded-xl border bg-base-300 p-14 md:p-28 m-1"
                            >
                                <h1 className="text-xl md:text-4xl">
                                    Welcome Back
                                    <motion.div
                                        style={{
                                            marginBottom: "-20px",
                                            marginRight: "-45px",
                                            paddingBottom: "20px",
                                            paddingRight: "45px",
                                            display: "inline-block",
                                        }}
                                        animate={{ rotate: 20 }}
                                        transition={{
                                            yoyo: Infinity,
                                            from: 0,
                                            duration: 0.6,
                                            ease: "easeInOut",
                                            type: "tween",
                                        }}
                                    >
                                        👋
                                    </motion.div>
                                </h1>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    autoComplete="username"
                                    className="input input-bordered w-full max-w-xs"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                ></input>
                                <span className="text-error">
                                    {errors.email &&
                                        touched.email &&
                                        errors.email}
                                </span>
                                <input
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className="input input-bordered w-full max-w-xs"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                ></input>
                                <span className="text-error">
                                    {errors.password &&
                                        touched.password &&
                                        errors.password}
                                </span>
                                <motion.button
                                    className="btn btn-primary space-x-3"
                                    type="submit"
                                    disabled={isSubmitting}
                                    initial="initial"
                                    whileHover="hover"
                                >
                                    <span>Login</span>
                                    <span>🔐</span>
                                </motion.button>
                            </form>
                        );
                    }}
                </Formik>
            </div>
        </Layout>
    );
};

export default Login;
