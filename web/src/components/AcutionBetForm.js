/* eslint-disable no-underscore-dangle */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, InputNumber, Row, Col } from 'antd';
import { FieldTimeOutlined } from '@ant-design/icons';

import Api from '../helpers/api';
import Countdown from './CountdownTimer';

const AuctionBetForm = props => {
	const { auction } = props;
	const { t } = useTranslation();

	const betSubmit = ({ price }) => {
		Api.put('/auctions/' + auction._id + '/bets', { price })
			.then(res => console.log(res.data))
			.catch(err => err.globalHandler && err.globalHandler());
	};

	const minValue = auction.price + 0.01;

	return (
		<Form
			id="betForm"
			layout="vertical"
			onFinish={betSubmit}
			initialValues={{
				price: minValue
			}}
		>
			<Row gutter={8}>
				<Col xs={12}>
					<p>{t('auction.price')}</p>
					<div className="price-label">
						{auction.price} <span className="currency">ETH</span>
					</div>
				</Col>
				<Col xs={12}>
					<p>
						<FieldTimeOutlined /> {t('auction.deadline')}
					</p>
					<div>
						<Countdown eventTime={auction.deadline} />
					</div>
				</Col>
				<Col xs={12}>
					<Form.Item name="price">
						<InputNumber min={minValue} precision={2} step={0.01} size="large" />
					</Form.Item>
				</Col>
				<Col xs={12}>
					<Button type="primary" htmlType="submit" size="large">
						{t('auction.bet')}
					</Button>
				</Col>
			</Row>
		</Form>
	);
};

export default AuctionBetForm;
