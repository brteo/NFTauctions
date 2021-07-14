/* eslint-disable no-await-in-loop */
import React, { useState, useEffect } from 'react';
import { Card, Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { listAuctions, getNftById } from '../helpers/api';

const { Meta } = Card;

const Auction = props => {
	const { t } = useTranslation();

	const [rows, setRows] = useState([]);

	const r = [];

	const getNft = (nftId, auction, k) => {
		getNftById(nftId)
			.then(response => {
				const nft = response.data;

				const elem = (
					<Col span={6} key={k}>
						<Card title={nft.title} hoverable cover={<img alt="alt" src={nft.url} />}>
							<Meta title={nft.title} description={auction.description} />
						</Card>
					</Col>
				);

				setRows(oldRows => [...oldRows, elem]);
			})
			.catch(err => {
				console.log(err);
			});
	};

	const getAuctions = () => {
		listAuctions()
			.then(async res => {
				const auctions = res.data;
				let i = 0;

				auctions.forEach(async auction => {
					console.log(auction);

					getNft(auction.nft, auction, i);

					i += 1;
				});
			})
			.catch(err => {
				const errorCode = err;
				console.log(errorCode);
			});
	};

	useEffect(() => {
		getAuctions();
	}, []);

	return (
		<div className="site-card-wrapper">
			<Row gutter={16}>{rows}</Row>
		</div>
	);
};

export default Auction;
