import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Formik, Field } from "formik";
import { gql, useQuery, useApolloClient } from "@apollo/client";
import { motion } from "framer-motion";

import useAuth from "../store/authStore.js";

import Layout from "../components/Layout";
import ErrorAlert from "../components/ErrorAlert";
import VisitorSuggestions from "../components/VisitorSuggestions.jsx";

import AlertGroup from "../components/AlertGroup";
import Alert from "../components/Alert";

const getFormattedDateString = (date) => {
    if (date instanceof Date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return [
            date.getFullYear(),
            (month > 9 ? "" : "0") + month,
            (day > 9 ? "" : "0") + day,
        ].join("-");
    }
};

const CreateInvite = ({ name, email, idNumber, idDocType }) => {
    // Get Instance of NextJS router to redirect to different pages
    const router = useRouter();
    //let { name, email, idNumber, idDocType } = router.query;

    // Get Apollo client from provider
    const client = useApolloClient();

    // Manipulate state for showing error alert
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    // Number of invites allowed to be sent/open of resident
    const [numInvitesAllowed, setNumInvitesAllowed] = useState(0);

    // Invite limit reached state
    const [limitReached, setLimitReached] = useState(false);

    // Manipulate state for showing error alert
    const [errorMessage, setErrorMessage] = useState("");

    // Whether or not parking is available
    const [isParkingAvailable, setIsParkingAvailable] = useState(true);

    const [now, setNow] = useState(getFormattedDateString(new Date()));

    // Get Data From JWT Token
    const jwtTokenData = useAuth((state) => {
        return state.decodedToken;
    })();

    // Car Animation Framer Motion Variant
    const driveAway = {
        initial: {
            scale: 1.2,
            x: 0,
        },
        animate: {
            x: 900,
        },
    };

    const isParkingAvailableQuery = useQuery(gql`
        query {
          isParkingAvailable(startDate: "${now}")
        }
    `);

    const numInvitesQuery = useQuery(gql`
        query {
            getNumInvitesPerResident {
                value
            }
        }
    `);

    const numInvitesOfResidentQuery = useQuery(gql`
        query {
             getNumberOfOpenInvites(email: "${jwtTokenData.email}") 
        }
    `);

    useEffect(() => {
        if (!numInvitesQuery.loading && !numInvitesQuery.error) {
            setNumInvitesAllowed(
                numInvitesQuery.data.getNumInvitesPerResident.value
            );
        } else if (numInvitesQuery.error) {
            if (numInvitesQuery.error.message === "Unauthorized") {
                router.push("/expire");
            }
            setErrorMessage(numInvitesQuery.error.message);
            setShowErrorAlert(true);
        }

        if (
            !numInvitesOfResidentQuery.loading &&
            !numInvitesOfResidentQuery.error &&
            numInvitesAllowed !== 0
        ) {
            const numSent =
                numInvitesOfResidentQuery.data
                    .getTotalNumberOfInvitesOfResident;
            if (numSent >= numInvitesAllowed && jwtTokenData.permission === 2) {
                setErrorMessage("Invite Limit Reached");
                setLimitReached(true);
                setShowErrorAlert(true);
            } else {
                setLimitReached(false);
                setShowErrorAlert(false);
            }
        } else if (
            !numInvitesOfResidentQuery.loading &&
            numInvitesOfResidentQuery.error
        ) {
            if (numInvitesOfResidentQuery.error.message === "Unauthorized") {
                router.push("/expire");
            }
            setErrorMessage(numInvitesOfResidentQuery.error.message);
            setShowErrorAlert(true);
        }

        if (
            !isParkingAvailableQuery.loading &&
            !isParkingAvailableQuery.error
        ) {
            setIsParkingAvailable(
                isParkingAvailableQuery.data.isParkingAvailable
            );
        } else if (
            !isParkingAvailableQuery.loading &&
            isParkingAvailableQuery.error
        ) {
            if (isParkingAvailableQuery.error.message === "Unauthorized") {
                router.push("/expire");
            }
            setErrorMessage(isParkingAvailableQuery.error.message);
            setShowErrorAlert(true);
        }
    }, [
        numInvitesQuery,
        numInvitesOfResidentQuery,
        numInvitesAllowed,
        limitReached,
        isParkingAvailableQuery,
        setNow,
    ]);

    return (
        <Layout>
            <AlertGroup>
                <Alert
                    message={errorMessage}
                    showAlert={showErrorAlert}
                    error
                />
            </AlertGroup>
            <div className="relative flex h-full min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden pb-3">
                <Formik
                    initialValues={{
                        email: !email ? "" : email,
                        idDoc: !idDocType ? "RSA-ID" : idDocType,
                        name: !name ? "" : name,
                        idValue: !idNumber ? "" : idNumber,
                        visitDate: now,
                        reserveParking: false,
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
                            errors.name = "Required";
                        } else if (!/[A-Za-z]+/i.test(values.name)) {
                            errors.name =
                                "Name contains non alphabetic characters";
                        } else if (!values.idValue) {
                            errors.idValue = "Required";
                        } else if (
                            (values.idDoc === "RSA-ID" ||
                                values.idDoc === "Drivers-License") &&
                            !/^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7}))$/i.test(
                                values.idValue
                            )
                        ) {
                            errors.idValue = "Invalid RSA ID Number";
                        } else if (
                            values.idDoc === "UP-Student-ID" &&
                            !/^\d{8}$/i.test(values.idValue)
                        ) {
                            errors.idValue = "Invalid UP student number";
                        } else if (!values.visitDate) {
                            errors.visitDate = "Please add a date";
                        }

                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        const CREATE_INVITE = gql`
                            mutation {
                                createInvite(
                                    userEmail: "${jwtTokenData.email}"
                                    visitorEmail: "${values.email}"
                                    visitorName: "${values.name.toLowerCase()}"
                                    IDDocType: "${values.idDoc}"
                                    IDNumber: "${values.idValue}"
                                    inviteDate: "${values.visitDate}"
                                    requiresParking: ${values.reserveParking}
                            )
                        }
                        `;

                        client
                            .mutate({
                                mutation: CREATE_INVITE,
                            })
                            .then((res) => {
                                if (res.data.createInvite) {
                                    router.push("/visitorDashboard");
                                    setShowErrorAlert(false);
                                    setSubmitting(false);
                                }
                            })
                            .catch((err) => {
                                setSubmitting(false);
                                if (err.message === "Unauthorized") {
                                    router.push("/expire");
                                    return;
                                } else {
                                    setErrorMessage(err.message);
                                    setShowErrorAlert(true);
                                }
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
                                className="md:p-26 prose form-control mt-3 space-y-3 rounded-none bg-base-300 p-14 md:rounded-xl"
                            >
                                <h1>
                                    Let&apos;s{" "}
                                    <span className="text-secondary">
                                        Invite
                                    </span>{" "}
                                    Someone🔥
                                </h1>

                                <span className="text-md mb-1 font-bold">
                                    Invite Date:
                                </span>

                                <input
                                    type="date"
                                    name="visitDate"
                                    placeholder="Visit Date"
                                    className="input input-bordered w-full"
                                    min={getFormattedDateString(new Date())}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setNow(e.currentTarget.value);
                                    }}
                                    onBlur={handleBlur}
                                    value={values.visitDate}
                                />

                                {!values.name.length > 0 && !email && !idNumber && !idDocType ? (
                                    <VisitorSuggestions date={now} />
                                ):(
                                    <div></div>
                                )}
                                

                                <br/>

                                <span className="text-md mb-1 font-bold">
                                        Visitor Details:
                                </span>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Visitor Email"
                                    autoComplete="username"
                                    className="input input-bordered w-full"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                />

                                <span className="text-error">
                                    {errors.email &&
                                        touched.email &&
                                        errors.email}
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
                                    <option value="UP-Student-ID">
                                        Student Number
                                    </option>
                                </Field>

                                <input
                                    type="text"
                                    name="idValue"
                                    placeholder="Enter ID number"
                                    className="input input-bordered w-full"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.idValue}
                                />
                                <span className="text-error">
                                    {errors.idValue &&
                                        touched.idValue &&
                                        errors.idValue}
                                </span>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter Visitor Name"
                                    className="input input-bordered w-full"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.name}
                                />
                                <span className="text-error">
                                    {errors.name && touched.name && errors.name}
                                </span>

                                <br/>

                                <motion.label className="label cursor-pointer">
                                    <motion.span
                                        initial="initial"
                                        whileHover="animate"
                                        className="label-text overflow-x-hidden pr-3"
                                    >
                                        Reserve Parking{" "}
                                        <motion.span
                                            initial={false}
                                            className="inline-block"
                                            animate={{
                                                x: values.reserveParking
                                                    ? 0
                                                    : -500,
                                                transition: {
                                                    duration: 0.8,
                                                    ease: "easeInOut",
                                                },
                                            }}
                                            variants={driveAway}
                                        >
                                            {" "}
                                            🚗
                                        </motion.span>
                                    </motion.span>

                                    <motion.input
                                        className="disabled toggle"
                                        disabled={
                                            isParkingAvailable ? false : true
                                        }
                                        name="reserveParking"
                                        type="checkbox"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.reserveParking}
                                    />
                                    {!isParkingAvailable && (
                                        <span className="text-error">
                                            Parking Full
                                        </span>
                                    )}
                                </motion.label>

                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={isSubmitting || limitReached}
                                >
                                    Invite
                                </button>
                            </form>
                        );
                    }}
                </Formik>
            </div>
        </Layout>
    );
};

/*
export async function getStaticProps(context) {
    return {
        props: {
            protected: true,
        },
    };
}
*/

CreateInvite.getInitialProps = async ({ query }) => {
    const { name, email, idNumber, idDocType } = query;
    
    return {
        name: name ? name : "",
        email: email ? email : "",
        idNumber: idNumber ? idNumber : "",
        idDocType:  idDocType ? idDocType : "",
        protected: true
    }
};

export default CreateInvite;
