import React, { useState, useEffect } from 'react';
import { Row } from 'antd';
import { listAuctions } from '../helpers/api';

import AuctionCard from '../components/AuctionCard';

const Auction = props => {
	const [auctions, setAuctions] = useState([]);

	const getAuctions = () => {
		listAuctions()
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
		<div className="site-card-wrapper">
			<Row gutter={16}>{auctions}</Row>
		</div>
	);
};

export default Auction;
