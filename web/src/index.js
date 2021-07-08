import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import reportWebVitals from './reportWebVitals';

import { AppProvider } from './helpers/AppContext';
import FullpageLoading from './components/extra/FullpageLoading';
import './helpers/i18n';
import './styles/app.less';

ReactDOM.render(
	<Suspense fallback={<FullpageLoading />}>
		<AppProvider>
			<Routes />
		</AppProvider>
	</Suspense>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
