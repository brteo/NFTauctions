import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, InputNumber, Row, Col } from 'antd';
import { FieldTimeOutlined } from '@ant-design/icons';

import Api from '../helpers/api';
import AppContext from '../helpers/AppContext';
import Countdown from './CountdownTimer';

const { REACT_APP_CURRENCY } = process.env;

const AuctionBetForm = props => {
	const { auction } = props;
	const { t } = useTranslation();
	const { setShowLogin } = useContext(AppContext);

	const [form] = Form.useForm();
	const [minValue, setMinValue] = useState((auction.price + 0.01).toFixed(2));
	const [sendBet, setSendBet] = useState(false);
	const [betError, setBetError] = useState(false);

	const betSubmit = ({ price }) => {
		setSendBet(true);
		Api.put('/auctions/' + auction._id + '/bets', { price })
			.then(res => {
				setMinValue((res.data.price + 0.01).toFixed(2));
				setSendBet(false);
				form.resetFields();
			})
			.catch(err => {
				setSendBet(false);
				const statusCode = err.response ? err.response.status : null;
				const errorCode = err.response && err.response.data ? err.response.data.error : null;

				if (statusCode === 401 && errorCode === 401) {
					return setShowLogin(true);
				}
				if (errorCode === 215) {
					return setBetError(t('core:errors.215'));
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
						{auction.price} <span className="currency">{REACT_APP_CURRENCY}</span>
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
					<Form.Item name="price" validateStatus={betError ? 'error' : undefined} help={betError || undefined}>
						<InputNumber min={minValue} precision={2} step={0.01} size="large" onChange={() => setBetError(false)} />
					</Form.Item>
				</Col>
				<Col xs={12}>
					<Button type="primary" htmlType="submit" size="large" disabled={sendBet} loading={sendBet}>
						{t('auction.bet')}
					</Button>
				</Col>
			</Row>
		</Form>
	);
};

export default AuctionBetForm;
