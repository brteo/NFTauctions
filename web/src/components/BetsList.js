/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { Skeleton } from 'antd';
import io from 'socket.io-client';

import Api from '../helpers/api';

const UserCard = props => {
	const { auctionID } = props;
	const [bets, setBets] = useState(null);
	let socket;

	useEffect(() => {
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
		return <p>no bets</p>;
	}

	return bets.map(bet => (
		<p key={bet._id}>
			{bet.price} - {bet.user.nickname}
		</p>
	));
};

export default UserCard;
