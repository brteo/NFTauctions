import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Space } from 'antd';
import Nfts from '../components/Nfts';

const Home = props => {
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
