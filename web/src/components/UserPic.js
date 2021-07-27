/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Avatar, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';

const UserPic = props => {
	const { user, size, link, ...spreadProps } = props;

	let el;
	if (user !== null) {
		el = user.pic ? (
			<Avatar {...spreadProps} size={size} src={process.env.PUBLIC_URL + user._id} alt={user.nickname + ' avatar'} />
		) : (
			<Avatar {...spreadProps} size={size} icon={<UserOutlined />} alt={user.nickname + ' avatar'} />
		);
	} else {
		el = <Skeleton.Avatar active size={size} />;
	}

	if (link && user !== null) {
		return (
			<Link className="userPic" to={'/profile/' + user._id}>
				{el}
			</Link>
		);
	}

	return <span className="userPic">{el}</span>;
};

export default React.memo(UserPic);
