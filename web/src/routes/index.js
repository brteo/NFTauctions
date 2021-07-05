import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';

import ErrorPage from '../components/extra/ErrorPage';
import Home from './Home';

const Routes = props => {
	return (
		<BrowserRouter history={props.history}>
			<Layout>
				<Layout>
					<Layout.Content className="main-content">
						<Switch>
							<Route exact path="/" component={Home} />
							<Route exact path="/index.html" component={Home} />
							<Route component={() => <ErrorPage status="404" />} />
						</Switch>
					</Layout.Content>
				</Layout>
			</Layout>
		</BrowserRouter>
	);
};

export default Routes;
