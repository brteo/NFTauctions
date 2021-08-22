import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton, Empty } from 'antd';
import io from 'socket.io-client';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

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

				socket.on('auctions/' + auctionID + '/bets', bet => {
					const newBet = { ...bet, added: true };
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
		<div className="ant-list ant-list-split">
			{!bets.length ? (
				<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('auction.noBets')} />
			) : (
				<TransitionGroup>
					{bets.map(item => (
						<CSSTransition key={item._id} in={item.added} classNames="newBet" timeout={4500}>
							<Bet bet={item} />
						</CSSTransition>
					))}
				</TransitionGroup>
			)}
		</div>
	);
};

export default BetsList;
