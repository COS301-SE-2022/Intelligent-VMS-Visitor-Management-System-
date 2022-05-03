import { useState } from "react";
import { Formik } from 'formik';
import {
	ApolloClient,
	InMemoryCache,
	gql
} from "@apollo/client";

import Layout from "../components/Layout";

const Login = () => {

	const [showErrorAlert, setShowErrorAlert] = useState(false);

	return (
		<Layout>
			<div className="w-full min-h-[80vh] h-full flex justify-center items-center shadow">
				<Formik
					initialValues={{ email: '', password: '' }}
					validate={values => {
						const errors = {};
						if (!values.email) {
							errors.email = 'Required';
						} else if (
							!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
						) {
							errors.email = 'Invalid email address';
						}
						return errors;
					}}
					onSubmit={(values, { setSubmitting }) => {
						const client = new ApolloClient({
							uri: 'http://localhost:3001/graphql',
							cache: new InMemoryCache()
						});

						client.mutate(
							{
								mutation: gql`
								 	mutation {
										login(email: "${values.email}", password: "${values.password}") {
											email,
											access_token
										}
									 }
								`
							}
						).then(result => {
							setSubmitting(false);
							console.log(result);
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
						<form onSubmit={handleSubmit} className="form-control bg-base-300 space-y-4 p-14 md:p-28 rounded-xl prose">
							<h1>Welcome Back 👋</h1>
							<input type="email" name="email" placeholder="Email" className="input input-bordered w-full max-w-xs" onChange={handleChange}
								onBlur={handleBlur}
								value={values.email}></input>
							<span className="text-error">{errors.email && touched.email && errors.email}</span>
							<input type="password" name="password" autoComplete="current-password" placeholder="Password" className="input input-bordered w-full max-w-xs" onChange={handleChange}
								onBlur={handleBlur}
								value={values.password}></input>
							<button className="btn btn-primary" type="submit" disabled={isSubmitting}>
								Submit
							</button>
						</form>
					)}
				</Formik>


			</div>
		</Layout>
	);
}

export default Login;