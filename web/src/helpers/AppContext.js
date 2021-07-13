import React, { useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { connect, refreshToken, logout } from './api';

/* CONTEXT */
const AppContext = React.createContext({});
export default AppContext;

/* AXIOS INTERCEPTOR */
connect.interceptors.response.use(
	response => response,
	error => {
		const statusCode = error.response ? error.response.status : null;
		const errorCode = error.response && error.response.data ? error.response.data.error : null;
		if (statusCode === 401) {
			const originalRequest = error.config;
			// if Unauthorized and route different from "auth", try to get new auth with refresh token and make again original request
			if (!originalRequest.url.split('/').includes('auth')) {
				return refreshToken().then(() => connect(originalRequest));
			}
			// if Refresh token is not valid logout and refresh page because here we can not change App Context
			if (
				(errorCode === 310 || errorCode === 306 || errorCode === 401) &&
				JSON.parse(window.localStorage.getItem('user'))
			) {
				window.localStorage.setItem('user', null);
				return logout()
					.then(window.location.replace(window.location.origin))
					.catch(window.location.replace(window.location.origin));
			}
		}
		return Promise.reject(error);
	}
);

/* PROVIDER */
export const AppProvider = props => {
	const [user, setUser] = useLocalStorage('user', null);

	const handleLogout = () => logout().then(setUser(null));

	useEffect(() => {
		if (!user) return;
		refreshToken() // if user in local storage get new auth by refrsh token
			.then(res => setUser(res.data))
			.catch(err => {
				const errorCode = err.response && err.response.data ? err.response.data.error : null;
				if (errorCode === 310 || errorCode === 306 || errorCode === 401) return handleLogout(); // refresh token expired
				if (err.globalHandler) return err.globalHandler();
				return () => {};
			});
	}, []);

	return <AppContext.Provider value={{ user, setUser, handleLogout }}>{props.children}</AppContext.Provider>;
};
