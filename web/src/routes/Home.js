import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';

const { Title } = Typography;

const Home = props => {
	const { t } = useTranslation();

	return (
		<section>
			<Title>
				{process.env.REACT_APP_NAME} ({process.env.REACT_APP_VERSION})
			</Title>
			<p>{t('common.title')}</p>
		</section>
	);
};

export default Home;
