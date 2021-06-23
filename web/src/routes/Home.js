import React from 'react';
import { Card, Typography } from 'antd';

import APICheck from '../components/extra/APICheck';

const { Title } = Typography;

const Home = props => {
	return (
		<section>
			<Card type="inner">
				<Title>
					{process.env.REACT_APP_NAME} ({process.env.REACT_APP_VERSION})
				</Title>
				<APICheck />
			</Card>
		</section>
	);
};

export default Home;
