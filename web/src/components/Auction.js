import React from 'react';
import { Typography, Card, Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { listAuctions } from '../helpers/api';

const { Meta } = Card;

const Auction = props => {
	const { t } = useTranslation();

	const handleAuctions = () => {
		listAuctions()
			.then(res => {
				console.log(res);
				return res;
			})
			.catch(err => {
				const errorCode = err.response;
				console.log(errorCode);
			});
	};

	const auctions = handleAuctions();

	return (
		<div className="site-card-wrapper">
			<Row gutter={16}>
				<Col span={6}>
					<Card
						hoverable
						cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
					>
						<Meta title="Europe Street beat" description="www.instagram.com" />
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Auction;
