import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';

const { Title } = Typography;
const img = 'http://localhost:4566/dev-s3/test.jpg';

const Home = props => {
	const { t } = useTranslation();

	return (
		<section>
			<Title>
				{process.env.REACT_APP_NAME} ({process.env.REACT_APP_VERSION})
			</Title>
			<p>{t('common.title')}</p>
			<img src={img} alt="test s3" height="400" />
		</section>
	);
};

export default Home;
