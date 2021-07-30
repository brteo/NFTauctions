/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-underscore-dangle */
import React, { useContext } from 'react';
import { Avatar, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import AppContext from '../helpers/AppContext';

const UserPic = props => {
	const { user, size, link, ...spreadProps } = props;
	const { logged } = useContext(AppContext);
	let el;
	if (user) {
		el = user.pic ? (
			<Avatar
				{...spreadProps}
				size={size}
				src={logged && logged._id === user._id ? logged.pic : user.pic}
				alt={user.nickname + ' avatar'}
			/>
		) : (
			<Avatar {...spreadProps} size={size} icon={<UserOutlined />} alt={user.nickname + ' avatar'} />
		);
	} else {
		el = <Skeleton.Avatar active size={size} />;
	}

	if (link && user) {
		return (
			<Link className="userPic" to={'/profile/' + user._id}>
				{el}
			</Link>
		);
	}

	return <span className="userPic">{el}</span>;
};

export default React.memo(UserPic);
