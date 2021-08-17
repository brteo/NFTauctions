import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography, Empty } from 'antd';
import Nfts from '../components/Nfts';
import Users from '../components/Users';

const { Title } = Typography;

const Search = props => {
	const { t } = useTranslation();
	const query = new URLSearchParams(useLocation().search).get('query');

	return (
		<section className="padded-content">
			{query ? (
				<>
					<Title level={2}>{t('common.users')}</Title>
					<Users filter={query} />
					<Title level={2}>{t('common.nfts')}</Title>
					<Nfts filter={query} />
				</>
			) : (
				<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('common.no_results')} />
			)}
		</section>
	);
};

export default Search;
