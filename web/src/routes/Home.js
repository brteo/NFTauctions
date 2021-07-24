import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography, Button, Space } from 'antd';

const { Title } = Typography;

const Home = props => {
	const { t } = useTranslation();

	return (
		<section>
			<Title>
				{process.env.REACT_APP_NAME} ({process.env.REACT_APP_VERSION})
			</Title>
			<p>{t('common.title')}</p>
			<Space>
				<Link to="auctions">
					<Button>auctions</Button>
				</Link>
				<Link to="profile/60f1a2e408c1b430d95aa632">
					<Button>Admin profile</Button>
				</Link>
				<Link to="upload">
					<Button>upload demo</Button>
				</Link>
				<Link to="test">
					<Button>not found</Button>
				</Link>
			</Space>
		</section>
	);
};

export default Home;
