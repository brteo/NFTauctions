import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';

const { Title } = Typography;

const Profile = props => {
	const { t } = useTranslation();

	const { match } = props;

	return (
		<section>
			<Title>Profile {match.params.id}</Title>
			<p>{t('common.title')}</p>
		</section>
	);
};

export default Profile;
