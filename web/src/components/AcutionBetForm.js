import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, InputNumber, Row, Col } from 'antd';
import { FieldTimeOutlined } from '@ant-design/icons';

import Api from '../helpers/api';
import AppContext from '../helpers/AppContext';
import Countdown from './CountdownTimer';

const AuctionBetForm = props => {
	const { auction } = props;
	const { t } = useTranslation();
	const { setShowLogin } = useContext(AppContext);

	const [form] = Form.useForm();
	const [minValue, setMinValue] = useState((auction.price + 0.01).toFixed(2));

	const betSubmit = ({ price }) => {
		Api.put('/auctions/' + auction._id + '/bets', { price })
			.then(res => {
				setMinValue((res.data.price + 0.01).toFixed(2));
				form.resetFields();
			})
			.catch(err => {
				const statusCode = err.response ? err.response.status : null;
				const errorCode = err.response && err.response.data ? err.response.data.error : null;

				if (statusCode === 401 && errorCode === 401) {
					return setShowLogin(true);
				}
				return err.globalHandler && err.globalHandler();
			});
	};

	return (
		<Form
			id="betForm"
			form={form}
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