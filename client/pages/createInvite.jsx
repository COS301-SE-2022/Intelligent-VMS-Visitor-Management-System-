import { useState } from "react";
import { useRouter } from "next/router";
import jwtDecode from "jwt-decode";
import { Formik, Field } from "formik";
import {
	ApolloClient,
	InMemoryCache,
	gql,
	createHttpLink
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

import useAuth from "../store/authStore.js";
import Layout from "../components/Layout";

const CreateInvite = () => {
	const [showErrorAlert, setShowErrorAlert] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const token = useAuth((state) => state.access_token);
	const router = useRouter();

	return (
		<Layout>
			<div className="w-full min-h-[80vh] h-full flex flex-col justify-center items-center shadow relative overflow-hidden">
				<Formik
					initialValues={{ email: '', idDoc: 'id', idValue: '' }}
					validate={values => {
						const errors = {};
						if (!values.email) {
							errors.email = 'Required';
						} else if (
							!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
						) {
							errors.email = 'Invalid email address';
						} else if (!values.idValue) {
							errors.idValue = "Required";
						} else if ((values.idDoc === "id" || values.idDoc === "drivers-license")
							&& !/^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7}))$/i.test(values.idValue)
						) {
							errors.idValue = "Invalid RSA ID";
						} else if (values.idDoc === "up-student" && !/^\d{8}$/i.test(values.idValue)) {
							errors.idValue = "Invalid UP student number";
						}
						return errors;
					}}
					onSubmit={(values, { setSubmitting }) => {
						console.log(process.env.BACKEND_GRAPHQL_URL);

						const httpLink = createHttpLink({
							uri: "localhost:3000/graphql",
							header: { Authorization: `Bearer ${token}` }
						});

						const authLink = setContext((_, { headers }) => {
							return {
								headers: {
									...headers,
									authorization: token ? `Bearer ${token}` : "",
								}
							}
						});

						const client = new ApolloClient({
							uri: process.env.BACKEND_GRAPHQL_URL,
							cache: new InMemoryCache(),
							headers: {
								Authorization: `Bearer ${token}`
							}
						});

						const jwtToken = jwtDecode(token);

						client.mutate({
							mutation: gql`
                                mutation {
                                  createInvite(userEmail: "admin@mail.com", visitorEmail: "visitor@mail.com", IDDocType: "RSA-ID", IDNumber: "0109195273080") 
                                }
                            `
						}).then(result => {
							setSubmitting(false);

							setShowErrorAlert(false);

							router.push("/");
						}).catch(err => {
							setSubmitting(false);
							console.error(err);
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
						<form onSubmit={handleSubmit} className="form-control bg-base-300 space-y-4 p-14 md:p-26 rounded-xl prose">
							<h1>Let's Invite Someone🔥</h1>
							<input type="email" name="email" placeholder="Visitor Email" autoComplete="username" className="input input-bordered w-full" onChange={handleChange}
								onBlur={handleBlur}
								value={values.email} />

							<span className="text-error">{errors.email && touched.email && errors.email}</span>

							<Field as="select" className="select select-primary w-full" name="idDoc" onChange={handleChange} onBlur={handleBlur}>
								<option value="id">RSA ID</option>
								<option value="drivers-license">Driver's License</option>
								<option value="up-student">Student Number</option>
							</Field>

							<input type="text" name="idValue" placeholder="Enter ID number" className="input input-bordered w-full" onChange={handleChange}
								onBlur={handleBlur}
								value={values.idValue} />
							<span className="text-error">{errors.idValue && touched.email && errors.idValue}</span>

							<button className="btn btn-primary" type="submit" disabled={isSubmitting}>
								Invite
							</button>
						</form>
					)}
				</Formik>

				<div className={`absolute top-3 drop-alert ${showErrorAlert ? "active" : ""}`}>
					<div className="alert alert-error shadow-lg">
						<div>
							<svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
							<span>Error! {errorMessage}</span>
						</div>
					</div>
				</div>
			</div>

		</Layout >
	)
}

export async function getStaticProps(context) {
	return {
		props: {
			protected: true,
		},
	}
}

export default CreateInvite;
