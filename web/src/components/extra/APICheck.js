import React, { useState, useEffect } from 'react';
import { checkApi } from '../../helpers/api';

const APICheck = props => {
	const [message, setMessage] = useState('Loading...');

	useEffect(() => {
		checkApi()
			.then(res => setMessage(res.data.message))
			.catch(err => console.error(err));
	});

	return <p>{message}</p>;
};

export default APICheck;
