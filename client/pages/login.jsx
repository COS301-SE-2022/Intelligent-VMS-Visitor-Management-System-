import { useRouter } from "next/router";
import { useState } from "react";
import { Formik } from "formik";
import { gql, useMutation } from "@apollo/client";

import useAuth from "../store/authStore";

import Layout from "../components/Layout";
import ErrorAlert from "../components/ErrorAlert";

const Login = () => {
    const login = useAuth((state) => state.login);
    const logout = useAuth((state) => state.logout);
    const verify = useAuth((state) => state.setVerify);
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

    return (
        <Layout>
            <div className="relative flex h-full min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden shadow">
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
                        } else if(!values.password) {
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

                                router.push("/createInvite");
                            })
                            .catch((err) => {
                                setShowErrorAlert(true);
                                setSubmitting(false);
                                setErrorMessage(err.message);
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
                    }) => (
                        <form
                            onSubmit={handleSubmit}
                            className="prose form-control border space-y-4 rounded-xl bg-base-300 p-14 md:p-28"
                        >
                            <h1>Welcome Back 👋</h1>
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
                                {errors.email && touched.email && errors.email}
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
                                {errors.password && touched.password && errors.password}
                            </span>
                            <button
                                className="btn btn-primary"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                Login
                            </button>
                        </form>
                    )}
                </Formik>

                <ErrorAlert
                    message={errorMessage}
                    showConditon={showErrorAlert}
                />
            </div>
        </Layout>
    );
};

export default Login;
