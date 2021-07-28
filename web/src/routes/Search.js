import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Nfts from '../components/Nfts';

const Home = props => {
	const { t } = useTranslation();
	const query = new URLSearchParams(useLocation().search);

	console.log(props.location);
	return (
		<section className="padded-content">
			<Nfts filter={query.get('query')} />
		</section>
	);
};

export default Home;
