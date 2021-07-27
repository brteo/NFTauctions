import React, { useState, useEffect } from 'react';
import { Card, Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import Api from '../helpers/api';

const { Meta } = Card;

const Auction = props => {
	const { t } = useTranslation();

	const [rows, setRows] = useState();

	const getAuctions = () => {
		Api.get('/auctions')
			.then(res => {
				const auctions = res.data;

				const r = [];

				for (let i = 0; i < auctions.length; i += 1) {
					const auction = auctions[i];

					const getNft = nftId => {
						Api.get(`/nfts/`, nftId)
							.then(response => {
								console.log(response.data);
							})
							.catch(err => {
								console.log(err);
							});
					};

					getNft(auction.nft);

					r.push(
						<Col span={6} key={i}>
							<Card
								hoverable
								cover={<img alt="alt" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
							>
								<Meta title={auction.description} description="www.instagram.com" />
							</Card>
						</Col>
					);
				}
				setRows(r);
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
