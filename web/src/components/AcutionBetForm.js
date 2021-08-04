/* eslint-disable no-underscore-dangle */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Button, Form, InputNumber } from 'antd';
import { FieldTimeOutlined } from '@ant-design/icons';

import Api from '../helpers/api';
import Countdown from './CountdownTimer';

const { Title } = Typography;

const AuctionBetForm = props => {
	const { auction } = props;
	const { t } = useTranslation();

	const betSubmit = ({ price }) => {
		Api.put('/auctions/' + auction._id + '/bets', { price })
			.then(res => console.log(res.data))
			.catch(err => err.globalHandler && err.globalHandler());
	};

	return (
		<>
			<Title level={2}>Auction</Title>
			<p>{auction.description}</p>
			<p>
				{t('auction.basePrice')}: {auction.basePrice} ETH
			</p>
			<p>
				{t('auction.price')}: {auction.price} ETH
			</p>
			<Title level={3}>
				<FieldTimeOutlined /> <Countdown eventTime={auction.deadline} />
			</Title>
			<Form
				id="betForm"
				layout="vertical"
				onFinish={betSubmit}
				initialValues={{
					price: auction.price + 1
				}}
			>
				<Form.Item name="price">
					<InputNumber />
				</Form.Item>
				<Button type="primary" htmlType="submit" size="large">
					{t('auction.bet')}
				</Button>
			</Form>
		</>
	);
};

export default AuctionBetForm;
