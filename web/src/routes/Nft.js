/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography, Image, Button } from 'antd';
import { FieldTimeOutlined } from '@ant-design/icons';
import Api from '../helpers/api';
import UserPic from '../components/UserPic';
import Countdown from '../components/CountdownTimer';

const { Title } = Typography;

const Nft = props => {
	const { t } = useTranslation();

	const [nft, setNft] = useState();
	const [matches, setMatch] = useState(window.matchMedia('(max-width: 800px)').matches);

	const { id } = props.match.params;

	const getNft = idNft => {
		Api.get('/nfts/' + idNft)
			.then(res => {
				console.log(res.data);
				const nftData = res.data;
				const elem = (
					<>
						<div style={{ flex: '0 0 50%' }}>
							<Image
								alt="nft"
								src={nftData.url}
								style={{ borderRadius: 50, border: '3px solid yellow', position: 'fixed', maxWidth: '50%' }}
							/>
						</div>
						<div style={{ flex: '0 0 50%', textAlign: 'center' }}>
							<Title level={2}>{nftData.title}</Title>

							<Title level={5}>{nftData.description}</Title>

							<Title level={5}>
								<UserPic user={nftData.owner} size={110} />
								<br />
								<br />
								<Link to={'/profile/' + nftData.owner._id}>
									{t('auction.owner')}: {nftData.owner.nickname}
								</Link>
								<br />
								<Link to={'/profile/' + nftData.author._id}>
									{t('auction.author')}: {nftData.author.nickname}
								</Link>
							</Title>

							<Title level={5}> Tags: {nftData.tags.join(', ')}</Title>

							{nftData.auction !== undefined ? (
								<>
									<Title level={5}>{nftData.auction.description}</Title>
									<br />
									<Title level={5}>
										{t('auction.price')}: {nftData.auction.price} ETH
									</Title>
									<br />
									<Title>
										<FieldTimeOutlined /> <Countdown eventTime={nftData.auction.deadline} />
									</Title>
									<br />
									<Button type="primary" htmlType="submit" size="large" shape="round">
										{t('auction.bet')}
									</Button>
								</>
							) : (
								<></>
							)}
						</div>
					</>
				);

				setNft(elem);
			})
			.catch(err => {
				return err.globalHandler && err.globalHandler();
			});
	};

	useEffect(() => {
		getNft(id);
		const handler = e => setMatch(e.matches);
		window.matchMedia('(max-width: 800px)').addListener(handler);
	}, []);

	return (
		<>
			<br />
			<Title level={1}>NFT Info</Title>
			{!matches ? (
				<div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>{nft}</div>
			) : (
				<div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }}>{nft}</div>
			)}
		</>
	);
};

export default Nft;
