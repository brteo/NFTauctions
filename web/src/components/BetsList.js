/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton, List, Empty } from 'antd';
import io from 'socket.io-client';

import Api from '../helpers/api';
import Bet from './Bet';

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
		return <Skeleton active avatar paragraph={0} />;
	}

	return (
		<List
			itemLayout="horizontal"
			locale={{
				emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('auction.noBets')} />
			}}
			dataSource={bets}
			renderItem={item => <Bet bet={item} />}
		/>
	);
};

export default BetsList;
