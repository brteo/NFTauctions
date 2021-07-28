import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Image, Row, Col, View } from 'antd';
import Api from '../helpers/api';

const { Title } = Typography;

const Nft = props => {
	const { t } = useTranslation();

	const [nft, setNft] = React.useState();

	const { id } = props.match.params;

	const getNft = idNft => {
		Api.get('/nfts/' + idNft)
			.then(res => {
				console.log(res);
				const nftData = res.data;
				const elem = (
					<>
						<div style={{ flex: '0 0 50%', height: '100%', width: '100%', maxWidth: '100%', maxHeight: '100%' }}>
							<Image
								alt="nft"
								src={nftData.url}
								style={{ height: '100%', width: '100%', maxWidth: '100%', maxHeight: '100%' }}
							/>
						</div>
						<div style={{ flex: '0 0 50%' }}>
							<Title level={3} style={{ textAlign: 'center' }}>
								{nftData.title}
							</Title>
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
	}, []);

	return <div style={{ display: 'flex', flexDirection: 'row' }}>{nft}</div>;
};

export default Nft;
