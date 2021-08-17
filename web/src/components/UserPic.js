/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState, useContext } from 'react';
import { Avatar, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';

import AppContext from '../helpers/AppContext';
import Api from '../helpers/api';

const UserPic = props => {
	const { user, size, link, loadPic, ...spreadProps } = props;
	const { logged } = useContext(AppContext);
	const [info, setInfo] = useState(null);

	useEffect(() => {
		if (user) {
			if (user.id === undefined) user.id = user._id;

			if (logged && logged.id === user.id) {
				setInfo(logged);
			} else if (!user.pic && loadPic) {
				Api.get('/users/' + user.id + '/pic')
					.then(res => {
						setInfo({ ...user, pic: res.data });
					})
					.catch(setInfo(user));
			} else {
				setInfo(user);
			}
		}
	}, [user]);

	let el;
	if (info) {
		el = info.pic ? (
			<Avatar {...spreadProps} size={size} src={info.pic} alt={info.nickname + ' avatar'} />
		) : (
			<Avatar {...spreadProps} size={size} icon={<UserOutlined />} alt={info.nickname + ' avatar'} />
		);
	} else {
		el = <Skeleton.Avatar active size={size} />;
	}

	if (link && info) {
		return (
			<Link className="userPic" to={'/profile/' + info.id}>
				{el}
			</Link>
		);
	}

	return <span className="userPic">{el}</span>;
};

export default React.memo(UserPic);
