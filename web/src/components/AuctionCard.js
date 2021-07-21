import React from 'react';
import { Card, Col, Typography, Button } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const { Meta } = Card;

const AuctionCard = props => {
	const { t, i18n } = useTranslation();

	const { auction } = props;

	return (
		<Col span={6} key={props.k}>
			<Card title={<Title level={4}>{t('auction.nftTitle') + ': ' + auction.title}</Title>} hoverable>
				<Title level={5}>
					{t('auction.nftDescription')}: {auction.description}
				</Title>
				<Meta title={t('auction.auctionDescription') + ': ' + auction.description} />
				<br />
				<br />
				{t('auction.basePrice')}: {auction.basePrice}€
				<br />
				<br />
				<Button type="primary" style={{ float: 'right' }}>
					{t('auction.bet')}
				</Button>
			</Card>
		</Col>
	);
};

export default AuctionCard;
