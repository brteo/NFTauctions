/* eslint-disable no-underscore-dangle */
import React from 'react';

const UserHeader = props => {
	const { user } = props;

	// alt="User profile header image"
	return (
		<div
			className="userHeader"
			style={user !== null && user.header ? { backgroundImage: 'url(' + process.env.PUBLIC_URL + user._id + ')' } : {}}
		/>
	);
};

export default React.memo(UserHeader);
