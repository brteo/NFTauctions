import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Input, Button, Modal, Divider } from 'antd';
import { UserOutlined, LockOutlined, InfoCircleOutlined } from '@ant-design/icons';

import { connect } from '../helpers/api';
import AppContext from '../helpers/AppContext';

const Login = props => {
	const { show, handleClose } = props;

	const { t, i18n } = useTranslation();
	const { setLogged } = useContext(AppContext);

	const MODE = { INIT: t('login.continue'), LOGIN: t('login.login'), REGISTER: t('login.register') };

	const [loginMode, setLoginMode] = useState(MODE.INIT);
	const [pwdError, setPwdError] = useState(false);
	const [accountError, setAccountError] = useState(false);
	const [nicknameError, setNicknameError] = useState(false);
	const [emailValue, setEmailValue] = useState('');

	const [form] = Form.useForm();

	const handleBack = () => setLoginMode(MODE.INIT);
	const handleReset = () => {
		setLoginMode(MODE.INIT);
		form.resetFields();
	};

	const handleCheckEmail = email =>
		connect
			.get(`/auth/email/${email}`)
			.then(res => setLoginMode(MODE.LOGIN))
			.catch(err => {
				const errorCode = err.response && err.response.data ? err.response.data.error : null;
				if (errorCode === 404) {
					return setLoginMode(MODE.REGISTER);
				}
				return err.globalHandler && err.globalHandler();
			});

	const handleLogin = (email, password) =>
		connect
			.post(`/auth/login`, { email, password })
			.then(res => {
				setLogged(res.data);
				i18n.changeLanguage(res.data.lang);
				handleClose();
				handleReset();
			})
			.catch(err => {
				const errorCode = err.response && err.response.data ? err.response.data.error : null;
				if (errorCode === 301) return setPwdError(t('core:errors.' + errorCode));

				return err.globalHandler && err.globalHandler();
			});

	const handleRegister = (email, password, nickname, account) =>
		connect
			.post('/auth/register', { email, password, nickname, account, lang: i18n.language })
			.then(res => {
				setLogged(res.data);
				i18n.changeLanguage(res.data.lang);
				handleClose();
				handleReset();
			})
			.catch(err => {
				const errorCode = err.response && err.response.data ? err.response.data.error : null;
				if (errorCode === 350) return setAccountError(t('core:errors.' + errorCode));

				if (errorCode === 351) return setNicknameError(t('core:errors.' + errorCode));

				return err.globalHandler && err.globalHandler();
			});

	const handleSubmit = ({ email = '', password = '', nickname = '', account = '' }) => {
		if (loginMode === MODE.INIT) return handleCheckEmail(email);
		if (loginMode === MODE.LOGIN) return handleLogin(email, password);
		return handleRegister(email, password, nickname, account);
	};

	const footerBtn = (
		<>
			{loginMode !== MODE.INIT ? <Button onClick={() => handleBack()}>{t('common.back')}</Button> : ''}
			<Button form="loginForm" type="primary" htmlType="submit">
				{loginMode}
			</Button>
		</>
	);

	const validateMessages = { required: t('core:errors.201') };

	return (
		<Modal visible={show} title={t('login.title')} onCancel={() => handleClose()} footer={footerBtn}>
			<Form
				id="loginForm"
				form={form}
				layout="vertical"
				requiredMark={false}
				validateMessages={validateMessages}
				onFinish={handleSubmit}
			>
				<Form.Item
					name="email"
					rules={[
						{
							required: true
						},
						{
							type: 'email',
							message: t('core:errors.210')
						}
					]}
				>
					<Input
						prefix={<UserOutlined />}
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
								required: true
							}
						]}
					>
						<Input.Password prefix={<LockOutlined />} placeholder={t('core:fields.password')} />
					</Form.Item>
				)}

				{loginMode === MODE.REGISTER && (
					<>
						<Divider />
						<Form.Item
							name="nickname"
							label={t('login.nickname')}
							tooltip={{ title: t('login.nickname_tip'), icon: <InfoCircleOutlined /> }}
							validateStatus={nicknameError ? 'error' : undefined}
							help={nicknameError || undefined}
							onChange={() => setNicknameError(false)}
							rules={[
								{
									required: true
								}
							]}
						>
							<Input placeholder={t('login.nickname_placeholder')} />
						</Form.Item>

						<Form.Item
							name="account"
							label={t('login.account')}
							tooltip={{ title: t('login.account_tip'), icon: <InfoCircleOutlined /> }}
							validateStatus={accountError ? 'error' : undefined}
							help={accountError || undefined}
							onChange={() => setAccountError(false)}
							rules={[
								{
									required: true
								}
							]}
						>
							<Input placeholder={t('login.account_placeholder')} maxLength="12" />
						</Form.Item>
					</>
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
