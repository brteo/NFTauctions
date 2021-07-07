import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, Button } from 'antd';

import APICheck from './extra/APICheck';

import logo from '../img/logo.svg';

const { Header } = Layout;

const HeaderComponent = props => {
	const { t, i18n } = useTranslation();

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

	return (
		<Header className="topbar">
			<div className="logo-box">
				<img src={logo} alt="Trading Virtual Goods" id="logo" />
			</div>
			<div className="access-box">
				<APICheck />
				{langButtons}
			</div>
		</Header>
	);
};

export default HeaderComponent;
