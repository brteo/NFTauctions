import React, { useContext, useState } from 'react';
import { Form, Input, Button, Space } from 'antd';
import { useTranslation } from 'react-i18next';

import { login, register, checkEmail } from '../helpers/api';
import AppContext from '../helpers/AppContext';

const Login = props => {
	const { t } = useTranslation();
	const { setUser } = useContext(AppContext);

	const MODE = { INIT: t('login.continue'), LOGIN: t('login.login'), REGISTER: t('login.register') };

	const [feedback, setFeedback] = useState(null);
	const [loginMode, setLoginMode] = useState(MODE.INIT);
	const [emailValue, setEmailValue] = useState('');

	const handleReset = () => setLoginMode(MODE.INIT);

	const handleCheckEmail = email =>
		checkEmail(email)
			.then(res => setLoginMode(MODE.LOGIN))
			.catch(err => {
				const errorCode = err.response && err.response.data ? err.response.data.error : null;
				if (errorCode === 404) {
					return setLoginMode(MODE.REGISTER);
				}
				return err.errorHandler && err.errorHandler();
			});

	const handleLogin = (email, password) =>
		login(email, password)
			.then(res => {
				setUser(res.data);
			})
			.then(res => {
				setUser(JSON.stringify(res.data));
			})
			.catch(err => {
				const statusCode = err.response ? err.response.status : null;
				const errorCode = err.response && err.response.data ? err.response.data.error : null;
				if (statusCode === 401) {
					if (errorCode === 305) {
						return setFeedback(t('errors.305'));
					}
					return setFeedback(t('errors.401'));
				}
				return err.errorHandler && err.errorHandler();
			});

	const handleRegister = (email, password) =>
		register(email, password)
			.then(() => handleLogin(email, password))
			.catch(err => err.errorHandler && err.errorHandler());

	const handleSubmit = ({ email = '', password = '' }) => {
		if (loginMode === MODE.INIT) return handleCheckEmail(email);
		if (loginMode === MODE.LOGIN) return handleLogin(email, password);
		if (loginMode === MODE.REGISTER) return handleRegister(email, password);
		return setFeedback(t('errors.1'));
	};

	return (
		<Form name="basic" onFinish={handleSubmit}>
			<Form.Item
				label={t('fields.email')}
				name="email"
				rules={[
					{
						required: true,
						message: t('errors.200')
					}
				]}
			>
				<Input readOnly={loginMode !== MODE.INIT} value={emailValue} onChange={value => setEmailValue(value)} />
			</Form.Item>
			{loginMode !== MODE.INIT && (
				<Form.Item
					label={t('fields.password')}
					name="password"
					rules={[
						{
							required: true,
							message: t('errors.200')
						}
					]}
				>
					<Input.Password />
				</Form.Item>
			)}

			{loginMode === MODE.LOGIN && (
				<Space>
					<Form.Item>
						<p id="forgotPassword">{t('login.forgot password')}</p>
					</Form.Item>
				</Space>
			)}

			{feedback && (
				<Form.Item>
					<p className="loginFeedback">{feedback}</p>
				</Form.Item>
			)}

			<Form.Item>
				<Space>
					{loginMode !== MODE.INIT && <Button onClick={() => handleReset()}>{t('common.back')}</Button>}
					<Button type="primary" htmlType="submit">
						{t(loginMode)}
					</Button>
				</Space>
			</Form.Item>
		</Form>
	);
};

export default Login;
