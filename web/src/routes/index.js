import React, { useContext } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';

import AppContext from '../components/AppContext';
import ErrorPage from '../components/extra/ErrorPage';
import Home from './Home';
import Login from './Login';

const Routes = props => {
	const context = useContext(AppContext);

	return (
		<BrowserRouter history={props.history}>
			<Layout>
				{context.isAuth ? (
					<Layout>
						<Layout.Content className="main-content">
							<Switch>
								<Route exact path="/" component={Home} />
								<Route exact path="/index.html" component={Home} />
								<Route component={() => <ErrorPage status="404" />} />
							</Switch>
						</Layout.Content>
					</Layout>
				) : (
					<Switch>
						<Route component={() => <Login />} />
					</Switch>
				)}
			</Layout>
		</BrowserRouter>
	);
};

export default Routes;
