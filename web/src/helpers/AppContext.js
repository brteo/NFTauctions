import React, { useState, useEffect } from 'react';
import FullpageLoading from '../components/extra/FullpageLoading';

/* CONTEXT */
const AppContext = React.createContext({});
export default AppContext;

/* PROVIDER */
export const AppProvider = props => {
	const [init, setInit] = useState(0);
	const [isAuth, setAuth] = useState(0);

	useEffect(() => {
		setTimeout(() => {
			setInit(1);
		}, 1000);
	});

	return (
		<AppContext.Provider value={{ init, isAuth, setAuth }}>
			{init ? props.children : <FullpageLoading />}
		</AppContext.Provider>
	);
};
