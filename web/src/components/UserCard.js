/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Col, Typography, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import UserPic from './UserPic';

const { Title } = Typography;

const UserCard = props => {
	const { user } = props;
	console.log(user);
	return (
		<Col xs={12} sm={8} md={6} lg={6} xl={6} xxl={4} className="userCard">
			{user ? (
				<>
					<UserPic user={user} size={110} link />
					<Title level={5}>
						<Link to={'/profile/' + user._id}>{user.nickname}</Link>
					</Title>
				</>
			) : (
				<>
					<UserPic size={110} />
					<Skeleton title active paragraph={{ rows: 0 }} />
				</>
			)}
		</Col>
	);
};

export default UserCard;
