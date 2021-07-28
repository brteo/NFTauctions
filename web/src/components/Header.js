/* eslint-disable no-underscore-dangle */
import React, { useState, useContext } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout, Button, Modal, Row, Col, Input } from 'antd';

import AppContext from '../helpers/AppContext';
import APICheck from './extra/APICheck';
import Login from './Login';

import logo from '../img/logo.svg';

const { Header } = Layout;
const { Search } = Input;

const HeaderComponent = props => {
	const { t, i18n } = useTranslation();
	const history = useHistory();
	const { logged, handleLogout } = useContext(AppContext);
	const [showLogin, setShowLogin] = useState(false);
	const query = new URLSearchParams(useLocation().search);

	const changeLanguage = lang => i18n.changeLanguage(lang);

	const langButtons = (
		<>
			<Button type="link" onClick={() => changeLanguage('it')}>
				IT
			</Button>
			<Button type="link" onClick={() => changeLanguage('en')}>
				EN
			</Button>
		</>
	);

	const toggleLogin = () => {
		if (navigator.cookieEnabled) {
			setShowLogin(!showLogin);
		} else {
			Modal.error({
				title: t('cookie.title'),
				content: t('cookie.message')
			});
		}
	};
	const onChange = e => console.log(e.target.value);
	const onSearch = q => history.push(`search?query=${q}`);

	return (
		<>
			<Header className="topbar">
				<Row wrap={false} gutter={16} align="middle">
					<Col flex="none">
						<Link to="/">
							<img src={logo} alt="Trading Virtual Goods" id="logo" />
						</Link>
					</Col>
					<Col flex="auto">
						<Search
							placeholder="Search"
							onSearch={onSearch}
							onChange={onChange}
							defaultValue={query.get('query')}
							allowClear
						/>
					</Col>
					<Col flex="none">
						{process.env.NODE_ENV === 'development' && <APICheck />}
						{logged ? (
							<>
								<Link to={'/profile/' + logged._id}>{logged.nickname}</Link>
								<Button type="primary" onClick={() => handleLogout()}>
									{t('login.logout')}
								</Button>
							</>
						) : (
							<Button type="primary" onClick={() => toggleLogin()}>
								{t('login.btn')}
							</Button>
						)}
						{langButtons}
					</Col>
				</Row>
			</Header>
			<Login show={showLogin} handleClose={toggleLogin} />
		</>
	);
};

export default React.memo(HeaderComponent);
