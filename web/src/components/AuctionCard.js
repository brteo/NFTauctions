import React from 'react';
import { Card, Col, Typography, Button } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const { Meta } = Card;

const AuctionCard = props => {
	const { t, i18n } = useTranslation();

	const { auction } = props;

	console.log(auction);

	return (
		<Col span={6} key={props.k}>
			<Card
				title={<Title level={4}>{t('auction.nftTitle') + ': ' + auction.nft.title}</Title>}
				hoverable
				cover={<img alt="alt" src={auction.nft.url} />}
			>
				<Title level={5}>
					{t('auction.nftDescription')}: {auction.nft.description}
				</Title>
				<Meta title={t('auction.auctionDescription') + ': ' + auction.description} />
				<br />
				<br />
				{t('auction.author')}: {auction.nft.author.nickname}
				<br />
				{t('auction.owner')}: {auction.nft.owner.nickname}
				<br />
				{t('auction.category')}: {i18n.language === 'it' ? auction.nft.category.name.it : auction.nft.category.name.en}
				<br />
				{t('auction.tags')}: {auction.nft.tags.join(', ')}
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
