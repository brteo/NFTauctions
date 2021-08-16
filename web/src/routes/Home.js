import React from 'react';
import Nfts from '../components/Nfts';

const Home = props => {
	return (
		<section className="padded-content">
			<Nfts by="auctions" />
		</section>
	);
};

export default Home;
