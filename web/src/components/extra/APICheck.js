/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Tag } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';

import Api from '../../helpers/api';

const APICheck = props => {
	const [message, setMessage] = useState('Loading...');
	const [check, setCheck] = useState(0);

	useEffect(() => {
		Api.get('/')
			.then(res => {
				setMessage(res.data.message);
				setCheck(1);
			})
			.catch(err => {
				console.error(err);
				setCheck(-1);
			});
	}, []);

	const icon = check === 1 ? <CheckCircleOutlined /> : check === 0 ? <SyncOutlined /> : <ExclamationCircleOutlined />;
	const color = check === 1 ? 'success' : check === 0 ? 'processing' : 'error';

	return (
		<div className="api-check">
			<Tag icon={icon} color={color}>
				{message}
			</Tag>
		</div>
	);
};

export default APICheck;
