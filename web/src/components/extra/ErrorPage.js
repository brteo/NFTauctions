import React from 'react';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';

const ErrorPage = props => {
	const status = props.status ? props.status : '404';

	return (
		<Result
			status={status}
			title={status}
			subTitle="Sorry, the page you visited does not exist."
			extra={
				<Link to="/">
					<Button type="primary">Back Home</Button>
				</Link>
			}
		/>
	);
};

export default React.memo(ErrorPage);
