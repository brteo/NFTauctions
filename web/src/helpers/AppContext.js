import React, { useState, useEffect } from 'react';

/* CONTEXT */
const AppContext = React.createContext({});
export default AppContext;

/* PROVIDER */
export const AppProvider = props => {
	const [init, setInit] = useState(0);
	const [isAuth, setAuth] = useState(0);

	useEffect(() => {
		setInit(1);
	}, []);

	return <AppContext.Provider value={{ init, isAuth, setAuth }}>{props.children}</AppContext.Provider>;
};
