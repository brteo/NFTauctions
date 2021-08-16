/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography, Image, Row, Col, Skeleton } from 'antd';
import io from 'socket.io-client';

import Api from '../helpers/api';
import UserPic from '../components/UserPic';
import AuctionBetForm from '../components/AcutionBetForm';
import BetsList from '../components/BetsList';

const { Title } = Typography;

const Nft = props => {
	const { id: nftID } = props.match.params;
	const { t } = useTranslation();
	const [nft, setNft] = useState(null);

	useEffect(() => {
		let socket;

		Api.get('/nfts/' + nftID)
			.then(res => {
				setNft(res.data);
				if (res.data.auction !== undefined) {
					socket = io(process.env.REACT_APP_ENDPOINT);

					socket.on('auctions/' + res.data.auction._id, data => {
						setNft(prevState => ({
							...prevState,
							auction: {
								...prevState.auction,
								price: data.price
							}
						}));
					});
				}
			})
			.catch(err => err.globalHandler && err.globalHandler());

		return () => {
			if (socket) socket.disconnect();
			socket = null;
			setNft(null);
		};
	}, [nftID]);

	return (
		<section className="padded-content">
			{!nft ? (
				<Skeleton avatar={{ shape: 'square', size: 300 }} paragraph={{ rows: 4 }} active />
			) : (
				<>
					<Title level={1}>{nft.title}</Title>
					<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
						<Col xs={24} sm={12}>
							<div>
								<Image alt="nft" src={nft.url} />
							</div>
						</Col>
						<Col xs={24} sm={12}>
							<p>
								{t('auction.owner')}:{' '}
								<Link to={'/profile/' + nft.owner._id}>
									<UserPic user={nft.owner} />
								</Link>
								<Link to={'/profile/' + nft.owner._id}>{nft.owner.nickname}</Link>{' '}
							</p>
							<p>
								{t('auction.author')}:
								<Link to={'/profile/' + nft.author._id}>
									<UserPic user={nft.author} />
								</Link>
								<Link to={'/profile/' + nft.author._id}>{nft.author.nickname}</Link>
							</p>
							<p>{nft.description}</p>
							<p> Tags: {nft.tags.join(', ')}</p>

							{nft.auction !== undefined && <AuctionBetForm auction={nft.auction} />}
						</Col>
						{nft.auction && (
							<Col xs={24}>
								<Title level={3}>Bets</Title>
								<BetsList auctionID={nft.auction._id} />
							</Col>
						)}
					</Row>
				</>
			)}
		</section>
	);
};

export default Nft;
