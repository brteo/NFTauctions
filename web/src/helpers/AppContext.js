import React, { useState, useEffect } from 'react';

/* CONTEXT */
const AppContext = React.createContext({});
export default AppContext;

/* PROVIDER */
export const AppProvider = props => {
	const [init, setInit] = useState(0);
	const [user, setUser] = useState(null);

	useEffect(() => {
		setInit(1);
	}, []);

	return <AppContext.Provider value={{ init, user, setUser }}>{props.children}</AppContext.Provider>;
};
