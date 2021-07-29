import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';
import Nfts from '../components/Nfts';
import Users from '../components/Users';

const { Title } = Typography;

const Search = props => {
	const { t } = useTranslation();
	const query = new URLSearchParams(useLocation().search).get('query');

	return (
		<section className="padded-content">
			{' '}
			{query ? (
				<>
					<Title level={2}>Users</Title>
					<Users filter={query} />
					<Title level={2}>Nfts</Title>
					<Nfts filter={query} />
				</>
			) : (
				<>No search</>
			)}
		</section>
	);
};

export default Search;
