import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt from "jwt-decode";

import useAuth from "../store/authStore";

const RouteGuard = ({ children }) => {
	const router = useRouter();
	const [authorized, setAuthorized] = useState(false);
	const jwtToken = useAuth((state) => state.access_token);

	useEffect(() => {
		authCheck(router.asPath);

		// on route change start - hide page content by setting authorized to false  
		const hideContent = () => setAuthorized(false);
		router.events.on('routeChangeStart', hideContent);

		// on route change complete - run auth check 
		router.events.on('routeChangeComplete', authCheck)

		// unsubscribe from events in useEffect return function
		return () => {
			router.events.off('routeChangeStart', hideContent);
			router.events.off('routeChangeComplete', authCheck);
		}
	}, [])

	const authCheck = (url) => {
		const publicPaths = ['/login', '/'];
		const path = url.split('?')[0];
		const user = undefined;
		try {
			user = jwt(jwtToken);
		} catch (error) {
		}

		if (!user && !publicPaths.includes(path)) {
			setAuthorized(false);
			router.push({
				pathname: '/login',
				query: { returnUrl: router.asPath }
			});
		} else {
			setAuthorized(true);
		}
	};

	return (authorized && children);
}

export default RouteGuard;