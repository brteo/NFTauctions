import React from 'react';
import { Layout, Row, Col, Spin } from 'antd';

const FullpageLoading = props => {
	return (
		<Layout className="fullpage hider">
			<Row type="flex" justify="center" align="middle">
				<Col>
					<Spin />
				</Col>
			</Row>
		</Layout>
	);
};

export default React.memo(FullpageLoading);
