/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Empty } from 'antd';
import Api from '../helpers/api';
import UserCard from './UserCard';

const Users = props => {
	const { filter } = props;

	const { t } = useTranslation();
	const [users, setUsers] = useState(null);

	let endpoint = null;
	if (filter) endpoint = '/profile/filter/' + filter;
	else {
		endpoint = '/profile';
	}

	useEffect(() => {
		if (endpoint) {
			Api.get(endpoint)
				.then(res => {
					const usersList = res.data;
					const usersComponents = [];

					usersList.forEach(user => {
						const elem = <UserCard user={user} key={user._id} />;

						usersComponents.push(elem);
					});

					setUsers(
						usersComponents.length ? (
							usersComponents
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
			setUsers(null);
		};
	}, [endpoint]);

	const skeleton = (
		<>
			<UserCard /> <UserCard />
		</>
	);

	return (
		<section className="users">
			<Row justify="left" gutter={[16, 16]}>
				{users || skeleton}
			</Row>
		</section>
	);
};

export default React.memo(Users);
