import React, { useContext } from 'react';
import { Button, Card } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import AppContext from '../helpers/AppContext';
import logo from '../img/logo.svg';

const Login = props => {
	const { t, i18n } = useTranslation();
	const context = useContext(AppContext);

	const changeLanguage = lang => i18n.changeLanguage(lang);

	const langButtons = (
		<>
			<Button onClick={() => changeLanguage('it')} type="link">
				IT
			</Button>
			<Button onClick={() => changeLanguage('en')} type="link">
				EN
			</Button>
		</>
	);

	return (
		<section>
			<img src={logo} alt="Trading Virtual Goods" id="logo" />
			<Card title={t('title')} extra={langButtons}>
				<Button type="primary" onClick={() => context.setAuth(1)} icon={<LoginOutlined />}>
					{t('login')}
				</Button>
			</Card>
		</section>
	);
};

export default Login;
