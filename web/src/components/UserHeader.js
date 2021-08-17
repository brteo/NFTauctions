import React from 'react';

const UserHeader = props => {
	const { user } = props;

	// alt="User profile header image"
	return (
		<div
			className="userHeader bg-cover"
			style={user && user.header ? { backgroundImage: 'url(' + user.header + ')' } : {}}
		>
			{props.children}
		</div>
	);
};

export default React.memo(UserHeader);
