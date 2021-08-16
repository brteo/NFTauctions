/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'antd';
import io from 'socket.io-client';

import Api from '../helpers/api';

const BetsList = props => {
	const { auctionID } = props;
	const [bets, setBets] = useState(null);
	const { t } = useTranslation();

	useEffect(() => {
		let socket;

		Api.get('/auctions/' + auctionID + '/bets')
			.then(res => {
				setBets(res.data);
				socket = io(process.env.REACT_APP_ENDPOINT);

				socket.on('auctions/' + auctionID + '/bets', newBet => {
					setBets(prevState => [newBet, ...prevState]);
				});
			})
			.catch(err => err.globalHandler && err.globalHandler());

		return () => {
			if (socket) socket.disconnect();
			socket = null;
			setBets(null);
		};
	}, []);

	if (!bets) {
		return <Skeleton active />;
	}

	if (!bets.length) {
		return (
			<div className="no-results">
				<p>{t('auction.noBets')}</p>
			</div>
		);
	}

	return bets.map(bet => (
		<p key={bet._id}>
			{bet.price} - {bet.user.nickname}
		</p>
	));
};

export default BetsList;
