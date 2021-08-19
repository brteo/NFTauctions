/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout, Button, Modal, Row, Col, Space, Select, Tooltip } from 'antd';
import { PoweroffOutlined, MenuOutlined } from '@ant-design/icons';

import AppContext from '../helpers/AppContext';
import Login from './Login';

import logo from '../img/logo.svg';
import itFlag from '../img/flags/it.png';
import gbFlag from '../img/flags/gb.png';

import GlobalSearch from './controls/GlobalSearch';
import MobileDrawer from './MobileDrawer';
import UserPic from './UserPic';

const { Header } = Layout;

const HeaderComponent = props => {
	const { t, i18n } = useTranslation();
	const { logged, handleLogout, isMobile, showLogin, setShowLogin } = useContext(AppContext);

	const [showMobileDrawer, setShowMobileDrawer] = useState(false);
	const [goToCreate, setGoToCreate] = useState(false);

	const { language } = i18n;

	const history = useHistory();

	useEffect(() => {
		history.listen(() => {
			setShowMobileDrawer(false);
		});
	}, []);

	const changeLanguage = lang => i18n.changeLanguage(lang);

	const toggleLogin = isLogged => {
		if (isLogged && goToCreate) {
			setGoToCreate(false);
			setShowMobileDrawer(false);
			history.push('/create');
		}

		if (navigator.cookieEnabled) {
			setShowLogin(!showLogin);
		} else {
			Modal.error({
				title: t('cookie.title'),
				content: t('cookie.message')
			});
		}
	};

	const loginHandler = isLogged => {
		setGoToCreate(false);
		toggleLogin(false);
	};

	const createHandler = () => {
		if (!logged) {
			setGoToCreate(true);
			toggleLogin();
		} else {
			setShowMobileDrawer(false);
			history.push('/create');
		}
	};

	const buttons = mobile => (
		<>
			<Button type="primary" onClick={() => createHandler()}>
				{t('common.create')}
			</Button>
			{logged ? (
				!mobile ? (
					<Space>
						<UserPic user={logged} link />
						<Tooltip title={t('login.logout')} placement="bottom">
							<Button type="primary" shape="circle" icon={<PoweroffOutlined />} onClick={handleLogout} />
						</Tooltip>
					</Space>
				) : (
					<div className="mobile-drawer-user">
						<Space direction="vertical">
							<UserPic user={logged} link />
							<span>
								{t('profile.hi')},
								<br />
								<Link to={'/profile/' + logged._id}>{logged.nickname}</Link>
							</span>
							<Button type="secondary" onClick={handleLogout}>
								{t('login.logout')}
							</Button>
						</Space>
					</div>
				)
			) : (
				<Button type="primary" onClick={() => loginHandler(false)}>
					{t('login.btn')}
				</Button>
			)}
			<Select type="text" defaultValue={language} value={language} onChange={changeLanguage}>
				<Select.Option value="it">
					<img height="20" src={itFlag} alt="IT" />
				</Select.Option>
				<Select.Option value="en">
					<img height="20" src={gbFlag} alt="EN" />
				</Select.Option>
			</Select>
		</>
	);

	return (
		<>
			<Header className="topbar">
				{isMobile ? (
					<div className="mobile-topbar">
						<Link to="/">
							<img src={logo} alt="Trading Virtual Goods" id="logo" />
						</Link>
						<Space>
							{logged && <UserPic user={logged} link />}
							<Button type="primary" shape="circle" icon={<MenuOutlined />} onClick={() => setShowMobileDrawer(true)} />
						</Space>
					</div>
				) : (
					<Row wrap={false} gutter={16} align="middle">
						<Col flex="none">
							<Link to="/">
								<img src={logo} alt="Trading Virtual Goods" id="logo" />
							</Link>
						</Col>
						<Col flex="auto">
							<GlobalSearch />
						</Col>
						<Col flex="none">
							<Space size={16}>{buttons(false)}</Space>
						</Col>
					</Row>
				)}
			</Header>
			{isMobile && (
				<MobileDrawer show={showMobileDrawer} close={() => setShowMobileDrawer(false)}>
					<div className="mobile-drawer-box">
						<GlobalSearch />
						{buttons(true)}
					</div>
				</MobileDrawer>
			)}
			<Login show={showLogin} handleClose={toggleLogin} />
		</>
	);
};

export default React.memo(HeaderComponent);
