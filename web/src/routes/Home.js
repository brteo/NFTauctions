import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Button, message } from 'antd';

import { connect } from '../helpers/api';

const { Title } = Typography;

const Home = props => {
	const { t } = useTranslation();

	const globalError = () => {
		connect
			.get('/test')
			.then(() => {})
			.catch(error => error.globalHandler());
	};
	const menagedError = () => {
		connect
			.get('/test')
			.then(() => {})
			.catch(error => {
				message.error(error.response.data.error);
			});
	};

	return (
		<section>
			<Title>
				{process.env.REACT_APP_NAME} ({process.env.REACT_APP_VERSION})
			</Title>
			<p>{t('common.title')}</p>

			<Button type="primary" onClick={() => globalError()}>
				Global error
			</Button>
			<br />
			<br />
			<Button type="primary" onClick={() => menagedError()}>
				Menaged Error
			</Button>
		</section>
	);
};

export default Home;
