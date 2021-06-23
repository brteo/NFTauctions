import React, { useContext } from 'react';
import { Button, Card } from 'antd';
import { LoginOutlined } from '@ant-design/icons';

import AppContext from '../components/AppContext';

const Login = props => {
	const context = useContext(AppContext);

	return (
		<section>
			<Card title="Login">
				<Button type="primary" onClick={() => context.setAuth(1)} icon={<LoginOutlined />}>
					Login
				</Button>
			</Card>
		</section>
	);
};

export default Login;
