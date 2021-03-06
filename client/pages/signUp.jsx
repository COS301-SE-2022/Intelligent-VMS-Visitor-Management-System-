import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { gql, useQuery, useApolloClient } from "@apollo/client";
import { Field, Formik } from "formik";
import { motion } from "framer-motion";

import Layout from "../components/Layout";
import ErrorAlert from "../components/ErrorAlert";

import useAuth from "../store/authStore";

const SignUp = () => {
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
        if (verified && permission === -999) {
            router.push("/verify");
        } else if (permission >= 0) {
            router.push("/");
        }
    }, [router, verified, permission]);

    return (
        <Layout>
            <div className="relative mb-4 flex h-full min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden">
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
                        idDoc: "RSA-ID",
                        idNumber: "",
                        name: "",
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
                        } else if (!values.name) {
                            errors.name = "Name required";
                        } else if (!/[A-Za-z]+/i.test(values.name)) {
                            errors.name = "Invalid name";
                        } else if (
                            (values.idDoc === "RSA-ID" ||
                                values.idDoc === "Drivers-License") &&
                            !/^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7}))$/i.test(
                                values.idNumber
                            )
                        ) {
                            errors.idValue = "Invalid RSA ID Number";
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
                        client
                            .mutate({
                                mutation: gql`
                                mutation {
                                    signup(
                                        email: "${values.email}", 
                                        password: "${values.password}", 
                                        type: "${values.userType}", 
                                        idNumber: "${values.idNumber}",
                                        IDDocType: "${values.idDoc}",
                                        name: "${values.name}"
                                    )
                                }
                            `,
                            })
                            .then((res) => {
                                if (res.data.signup === true) {
                                    verify();
                                    router.push("/verify");
                                    setSubmitting(false);
                                } else {
                                    console.log(res);
                                }
                            })
                            .catch((err) => {
                                setError({
                                    message: err.message,
                                    showCondition: true,
                                });
                                setSubmitting(false);
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
                                className="prose form-control space-y-4 rounded-xl border p-14"
                            >
                                <h1>Let&apos;s Get Started ???</h1>
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
                                    {errors.email &&
                                        touched.email &&
                                        errors.email}
                                </span>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter Name"
                                    className="input input-bordered w-full"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.name}
                                />
                                <span className="text-error">
                                    {errors.name && touched.name && errors.name}
                                </span>

                                <Field
                                    as="select"
                                    className="select select-primary w-full"
                                    name="idDoc"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                >
                                    <option value="RSA-ID">RSA ID</option>
                                    <option value="Drivers-License">
                                        Driver&apos;s License
                                    </option>
                                </Field>

                                <input
                                    type="text"
                                    name="idNumber"
                                    placeholder="Enter ID number"
                                    className="input input-bordered w-full"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.idNumber}
                                />
                                <span className="text-error">
                                    {errors.idNumber &&
                                        touched.idNumber &&
                                        errors.idNumber}
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
                                            aria-label="resident"
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
                                            aria-label="receptionist"
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
                                        ????
                                    </motion.span>
                                </motion.button>
                            </form>
                        );
                    }}
                </Formik>
                <ErrorAlert
                    message={error.message}
                    showConditon={error.showCondition}
                />
            </div>
        </Layout>
    );
};

export default SignUp;
