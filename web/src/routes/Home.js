import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography, Button, Space } from 'antd';
import Nfts from '../components/Nfts';

const { Title } = Typography;

const Home = props => {
	const { t } = useTranslation();

	return (
		<section className="padded-content">
			<Space>
				<Link to="upload">
					<Button>upload demo</Button>
				</Link>
				<Link to="test">
					<Button>not found</Button>
				</Link>
			</Space>
			<br />
			<br />
			<Nfts by="auctions" />
		</section>
	);
};

export default Home;
