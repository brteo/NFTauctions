import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Input, Button, Modal } from 'antd';

import { login, register, checkEmail } from '../helpers/api';
import AppContext from '../helpers/AppContext';

const Login = props => {
	const { show, handleClose } = props;

	const { t } = useTranslation();
	const { setUser } = useContext(AppContext);

	const MODE = { INIT: t('login.continue'), LOGIN: t('login.login'), REGISTER: t('login.register') };

	const [loginMode, setLoginMode] = useState(MODE.INIT);
	const [pwdError, setPwdError] = useState(false);
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
				return err.globalHandler && err.globalHandler();
			});

	const handleLogin = (email, password) =>
		login(email, password)
			.then(res => {
				setUser(res.data);
				handleClose();
			})
			.catch(err => {
				const errorCode = err.response && err.response.data ? err.response.data.error : null;
				if (errorCode === 301) {
					return setPwdError(t('core:errors.' + errorCode));
				}

				return err.globalHandler && err.globalHandler();
			});

	const handleRegister = (email, password) =>
		register(email, password)
			.then(res => {
				setUser(res.data);
				handleClose();
			})
			.catch(err => err.globalHandler && err.globalHandler());

	const handleSubmit = ({ email = '', password = '' }) => {
		if (loginMode === MODE.INIT) return handleCheckEmail(email);
		if (loginMode === MODE.LOGIN) return handleLogin(email, password);
		return handleRegister(email, password);
	};

	const footerBtn = (
		<>
			{loginMode !== MODE.INIT ? <Button onClick={() => handleReset()}>{t('common.back')}</Button> : ''}
			<Button form="loginForm" type="primary" htmlType="submit">
				{loginMode}
			</Button>
		</>
	);

	return (
		<Modal visible={show} title={t('login.title')} onCancel={() => handleClose()} footer={footerBtn}>
			<Form id="loginForm" onFinish={handleSubmit}>
				<Form.Item
					name="email"
					rules={[
						{
							required: true,
							message: t('core:errors.200')
						},
						{
							type: 'email',
							message: t('core:errors.210')
						}
					]}
				>
					<Input
						readOnly={loginMode !== MODE.INIT}
						placeholder={t('core:fields.email')}
						value={emailValue}
						onChange={value => setEmailValue(value)}
					/>
				</Form.Item>
				{loginMode !== MODE.INIT && (
					<Form.Item
						name="password"
						validateStatus={pwdError ? 'error' : undefined}
						help={pwdError || undefined}
						onChange={() => setPwdError(false)}
						rules={[
							{
								required: true,
								message: t('core:errors.200')
							}
						]}
					>
						<Input.Password placeholder={t('core:fields.password')} />
					</Form.Item>
				)}

				{loginMode === MODE.LOGIN && (
					<div className="align-center">
						<Button type="link" id="forgotPassword">
							{t('login.forgot password')}
						</Button>
					</div>
				)}
			</Form>
		</Modal>
	);
};

export default Login;
