import React, { useState, useEffect, useLayoutEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import Api from './api';

/* CONTEXT */
const AppContext = React.createContext({});
export default AppContext;

/* AXIOS INTERCEPTOR */
Api.interceptors.response.use(
	response => response,
	error => {
		const statusCode = error.response ? error.response.status : null;
		const errorCode = error.response && error.response.data ? error.response.data.error : null;
		if (statusCode === 401) {
			const originalRequest = error.config;
			// if Unauthorized and route different from "auth", try to get new auth with refresh token and make again original request
			if (!originalRequest.url.split('/').includes('auth')) {
				return Api.get('/auth/rt').then(() => Api(originalRequest));
			}
			// if Refresh token is not valid logout and refresh page because here we can not change App Context
			if (
				(errorCode === 305 || errorCode === 306 || errorCode === 307 || errorCode === 401) &&
				JSON.parse(window.localStorage.getItem('user'))
			) {
				window.localStorage.setItem('user', null);
				return Api.get('/auth/logout')
					.then(window.location.replace(window.location.origin))
					.catch(window.location.replace(window.location.origin));
			}
		}
		return Promise.reject(error);
	}
);

/* PROVIDER */
export const AppProvider = props => {
	const [logged, setLogged] = useLocalStorage('user', null);
	const [isMobile, setIsMobile] = useState(false);
	const [showLogin, setShowLogin] = useState(false);

	const handleLogout = () => Api.get('/auth/logout').then(setLogged(null));

	useLayoutEffect(() => {
		const updateSize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		window.addEventListener('resize', updateSize);
		updateSize();

		return () => window.removeEventListener('resize', updateSize);
	}, []);

	useEffect(() => {
		if (!logged) return;
		Api.get('/auth/rt') // if user in local storage get new auth by refrsh token
			.then(res => setLogged(res.data))
			.catch(err => {
				const errorCode = err.response && err.response.data ? err.response.data.error : null;
				if (errorCode === 310 || errorCode === 306 || errorCode === 401) return handleLogout(); // refresh token expired
				if (err.globalHandler) return err.globalHandler();
				return () => {};
			});
	}, []);

	return (
		<AppContext.Provider value={{ logged, setLogged, isMobile, handleLogout, showLogin, setShowLogin }}>
			{props.children}
		</AppContext.Provider>
	);
};
