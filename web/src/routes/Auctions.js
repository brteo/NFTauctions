import React, { useState, useEffect } from 'react';
import { Row } from 'antd';
import Api from '../helpers/api';

import AuctionCard from '../components/AuctionCard';
import SearchBar from '../components/SearchBar';

const Auction = props => {
	const [auctions, setAuctions] = useState([]);

	const getAuctions = () => {
		Api.get('/auctions')
			.then(res => {
				const auctionList = res.data;
				let i = 0;

				auctionList.forEach(auction => {
					console.log(auction);

					const elem = <AuctionCard auction={auction} k={i} />;

					setAuctions(oldAuctions => [...oldAuctions, elem]);

					i += 1;
				});
			})
			.catch(err => {
				const errorCode = err;
				console.log(errorCode);
			});
	};

	useEffect(() => {
		getAuctions();
	}, []);

	return (
		<>
			<SearchBar />
			<br />
			<br />
			<div className="site-card-wrapper">
				<Row gutter={16}>{auctions}</Row>
			</div>
		</>
	);
};

export default Auction;
