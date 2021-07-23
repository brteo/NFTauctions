/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Avatar, Skeleton } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const UserPic = props => {
	const { user, size } = props;

	// alt="User profile header image"

	let el;
	if (user !== null) {
		el = user.pic ? (
			<Avatar size={size} src={process.env.PUBLIC_URL + user._id} />
		) : (
			<Avatar size={size} icon={<UserOutlined />} />
		);
	} else {
		el = <Skeleton.Avatar active size={size} />;
	}

	return <span className="userPic">{el}</span>;
};

export default React.memo(UserPic);
