import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';

import ErrorPage from '../components/extra/ErrorPage';
import Header from '../components/Header';

import Home from './Home';
import Profile from './Profile';
import Upload from './Upload';

const { Content, Footer } = Layout;

const Routes = props => {
	return (
		<BrowserRouter history={props.history}>
			<Layout>
				<Header />
				<Content className="main-content">
					<Switch>
						<Route exact path="/" component={Home} />
						<Route exact path="/index.html" component={Home} />
						<Route exact path="/profile/:id" component={Profile} />
						<Route exact path="/upload" component={Upload} />
						<Route component={() => <ErrorPage status="404" />} />
					</Switch>
				</Content>
				<Footer className="footer">
					{new Date().getFullYear()} &copy; Trading Virtual Goods - All rights reserved
				</Footer>
			</Layout>
		</BrowserRouter>
	);
};

export default Routes;
