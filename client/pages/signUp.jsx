import { useState } from "react";
import Layout from "../components/Layout";
import { Field, Formik } from "formik";
import { motion } from "framer-motion";

import useAuth from "../store/authStore";

const SignUp = () => {
    
    const [showUsageForm, setShowUsageForm] = useState(false);

    const scaleEmoji = {
        initial: {
            scale: 1.2,
        },
        hover: {
            scale: [1.5,1,1.5,2,1.5],
            rotate: [10, -10, 10, -20, 0],
            transition: {
                ease: "easeInOut",
                duration: 0.7
            }
        },
    };

    const flyEmojiAway = {
        initial: {
            y: 0,
            x: 0
        },
        hover: {
            y: -100,
            x: 200,
            transition: {
                ease: "linear",
                duration: 1.2
            }
        }
    };

    return (
        <Layout>
            <div className="relative flex flex-col h-full min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden">
                <ul className="steps mb-3 mt-2 text-xs md:text-base">
                    <li className="step step-primary">Tell Us About Yourself</li>
                    <li className="step">Verify Email</li>
                    <li className="step">Authorize Account</li>
                </ul>

                <Formik
                initialValues={{ email: "", password: "", confirmPassword: "", apartmentNumber: "", idNumber: "" }}
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
                        } else if(!values.confirmPassword) {
                            errors.confirmPassword = "Required";
                        } else if(!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/i.test(
                            values.password
                        )) {
                            errors.password = "Password needs minimum of 8 characters with one number and one special character";
                        } else if(values.confirmPassword !== values.password) {
                            errors.confirmPassword = "Passwords do not match";
                        } else if(!values.userType) {
                            errors.userType = "Please select user type";
                        } 

                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        alert({values});
                        setSubmitting(false);
                        setShowUsageForm(true);
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
                            className="prose form-control rounded-xl border p-14 space-y-4"
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
                            <span className="text-error text-sm md:text-base">
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
                            <span className="text-error text-sm md:text-base max-w-xs">
                                {errors.password && touched.password && errors.password}
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
                            <span className="text-error text-sm md:text-base">
                                {errors.confirmPassword && touched.confirmPassword && errors.confirmPassword}
                            </span>
                            <p className="text-sm md:text-lg lg:text-xl">I&apos;m a... <span>{values.userType}</span></p>
                            <div className="flex items-center space-x-3">
                                <label className="flex items-center space-x-3">
                                    <span className="text-sm md:text-base font-bold">Resident</span>
                                    <Field onChange={handleChange} onBlur={handleBlur} className="radio checked:bg-primary" type="radio" name="userType" value="resident" />
                                </label>
                                <label className="flex items-center space-x-3">
                                    <span className="text-sm md:text-base font-bold">Receptionist</span>
                                    <Field onChange={handleChange} onBlur={handleBlur} className="radio checked:bg-secondary" type="radio" name="userType" value="receptionist" />
                                </label>
                            </div>
                            <span className="text-error">
                                {errors.userType && touched.userType && errors.userType}
                            </span>
                            <motion.button
                                className="btn btn-primary space-x-4 overflow-y-hidden"
                                type="submit"
                                disabled={isSubmitting}
                                initial="initial"
                                whileHover="hover"
                                whileFocus="hover"
                            >
                                Let&apos;s Go <motion.span className="ml-3" variants={flyEmojiAway}> 🚀</motion.span>
                            </motion.button>
                        </form>
                    )}
                </Formik>
            </div>
        </Layout>
    );
};

export default SignUp;
