import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';

import ErrorPage from '../components/extra/ErrorPage';
import APICheck from '../components/extra/APICheck';
import Header from '../components/Header';

import Home from './Home';
import Search from './Search';
import Create from './Create';
import Nft from './Nft';
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
						<Route exact path="/search" component={Search} />
						<Route exact path="/Create" component={Create} />
						<Route exact path="/nft/:id" component={Nft} />
						<Route exact path="/profile/:id" component={Profile} />
						{process.env.NODE_ENV === 'development' && <Route exact path="/upload" component={Upload} />}

						<Route component={() => <ErrorPage status="404" />} />
					</Switch>
				</Content>
				<Footer className="footer">
					{process.env.NODE_ENV === 'development' && <APICheck />}
					{new Date().getFullYear()} &copy; Trading Virtual Goods - All rights reserved
				</Footer>
			</Layout>
		</BrowserRouter>
	);
};

export default Routes;
