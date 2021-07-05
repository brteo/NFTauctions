import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Typography, Button, message } from 'antd';

import APICheck from '../components/extra/APICheck';
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
			<Card type="inner">
				<Title>
					{process.env.REACT_APP_NAME} ({process.env.REACT_APP_VERSION})
				</Title>
				<p>{t('common.title')}</p>
				<APICheck />
				<Button type="primary" onClick={() => globalError()}>
					Global error
				</Button>
				<br />
				<br />
				<Button type="primary" onClick={() => menagedError()}>
					Menaged Error
				</Button>
			</Card>
		</section>
	);
};

export default Home;
