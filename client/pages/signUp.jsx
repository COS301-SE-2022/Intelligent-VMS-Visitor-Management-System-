import Layout from "../components/Layout";
import { Formik } from "formik";
import { motion } from "framer-motion";

import useAuth from "../store/authStore";

const SignUp = () => {

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

    return (
        <Layout>
            <div className="relative flex flex-col h-full min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden">

                <ul className="steps mb-3 mt-2 text-xs md:text-base">
                  <li className="step step-primary">Tell Us About Yourself</li>
                  <li className="step">Usage</li>
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
                            <motion.button
                                className="btn btn-primary space-x-4"
                                type="submit"
                                disabled={isSubmitting}
                                initial="initial"
                                whileHover="hover"
                                whileFocus="hover"
                            >
                                Let&apos;s Go <motion.span className="ml-3" variants={scaleEmoji}> 🎉</motion.span>
                            </motion.button>
                        </form>
                    )}
                </Formik>
            </div>
        </Layout>
    );
};

export default SignUp;
