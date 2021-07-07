import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, Button, Drawer } from 'antd';

import APICheck from './extra/APICheck';
import Login from './Login';

import logo from '../img/logo.svg';

const { Header } = Layout;

const HeaderComponent = props => {
	const { t, i18n } = useTranslation();
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
					<APICheck />
					<Button type="primary" onClick={() => toggleLogin()}>
						{t('login.btn')}
					</Button>
					{langButtons}
				</div>
			</Header>
			<Drawer title={t('login.title')} visible={showLogin}>
				<Login />
			</Drawer>
		</>
	);
};

export default HeaderComponent;
