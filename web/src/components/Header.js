import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, Button } from 'antd';

import AppContext from '../helpers/AppContext';
import APICheck from './extra/APICheck';
import Login from './Login';

import logo from '../img/logo.svg';

const { Header } = Layout;

const HeaderComponent = props => {
	const { t, i18n } = useTranslation();
	const { user, handleLogout } = useContext(AppContext);
	const [showLogin, setShowLogin] = useState(false);

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

	const toggleLogin = () => setShowLogin(!showLogin);

	return (
		<>
			<Header className="topbar">
				<div className="logo-box">
					<img src={logo} alt="Trading Virtual Goods" id="logo" />
				</div>
				<div className="access-box">
					{process.env.NODE_ENV === 'development' && <APICheck />}
					{user ? (
						<>
							{user.name || user.email}
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
				</div>
			</Header>
			<Login show={showLogin} handleClose={toggleLogin} />
		</>
	);
};

export default HeaderComponent;
