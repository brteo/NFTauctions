/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Empty } from 'antd';
import Api from '../helpers/api';
import NftCard from './NftCard';

const Nfts = props => {
	const { by, user, filter } = props;

	const { t } = useTranslation();
	const [nfts, setNfts] = useState(null);

	let endpoint = null;
	if (filter) endpoint = '/nfts/filter/' + filter;
	else {
		switch (by) {
			case 'owner':
				if (user) endpoint = '/profile/' + user._id + '/owned';
				break;
			case 'creator':
				if (user) endpoint = '/profile/' + user._id + '/created';
				break;
			case 'auctions':
				endpoint = '/nfts/auctions';
				break;
			default:
				endpoint = '/nfts';
				break;
		}
	}

	useEffect(() => {
		if (endpoint) {
			Api.get(endpoint)
				.then(res => {
					const nftsList = res.data;
					const nftsComponents = [];

					nftsList.forEach(nft => {
						const elem = <NftCard nft={nft} key={nft._id} />;

						nftsComponents.push(elem);
					});

					setNfts(
						nftsComponents.length ? (
							nftsComponents
						) : (
							<Col xs={24}>
								<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('common.no_results')} />
							</Col>
						)
					);
				})
				.catch(err => {
					return err.globalHandler && err.globalHandler();
				});
		}

		return () => {
			setNfts(null);
		};
	}, [endpoint]);

	const skeleton = (
		<>
			<NftCard />
			<NftCard />
			<NftCard />
			<NftCard />
		</>
	);

	return (
		<section className="nfts">
			<Row justify="left" gutter={[16, 16]}>
				{nfts || skeleton}
			</Row>
		</section>
	);
};

export default React.memo(Nfts);
