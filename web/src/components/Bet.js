import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { List } from 'antd';
import moment from 'moment';

import UserPic from './UserPic';

const Bet = props => {
	const { bet } = props;

	const calculateTime = () => moment(bet.time).fromNow();

	const [time, setTime] = useState(calculateTime());

	useEffect(() => {
		const timer = setTimeout(() => {
			setTime(calculateTime());
		}, 1000);

		return () => {
			if (timer) clearTimeout(timer);
		};
	});

	return (
		<List.Item className="bet-tpl">
			<List.Item.Meta
				avatar={<UserPic user={bet.user} link loadPic size={56} />}
				title={
					<>
						<Link to={'/profile/' + bet.user.id}>{bet.user.nickname}</Link> <span className="time-label">{time}</span>
					</>
				}
				description={
					<div className="price-label">
						{bet.price} <span className="currency">ETH</span>
					</div>
				}
			/>
		</List.Item>
	);
};

export default Bet;
