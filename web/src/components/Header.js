/* eslint-disable no-underscore-dangle */
import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout, Button, Modal, Row, Col, Input } from 'antd';

import AppContext from '../helpers/AppContext';
import APICheck from './extra/APICheck';
import Login from './Login';

import logo from '../img/logo.svg';

import GlobalSearch from './controls/GlobalSearch';
import UserPic from './UserPic';

const { Header } = Layout;

const HeaderComponent = props => {
	const { t, i18n } = useTranslation();

	const { logged, handleLogout } = useContext(AppContext);
	const [showLogin, setShowLogin] = useState(false);

	const changeLanguage = lang => i18n.changeLanguage(lang);

	const langButtons = (
		<>
			<Button type="link" onClick={() => changeLanguage('it')}>
				IT
			</Button>
			<Button type="link" onClick={() => changeLanguage('en')}>
				EN
			</Button>
		</>
	);

	const toggleLogin = () => {
		if (navigator.cookieEnabled) {
			setShowLogin(!showLogin);
		} else {
			Modal.error({
				title: t('cookie.title'),
				content: t('cookie.message')
			});
		}
	};

	const history = useHistory();

	const onSearchSelect = (value, option) =>
		option.type === 'nft' ? history.push('/nft/' + option.id) : history.push('/profile/' + option.id);
	const parseSearchResults = results => {
		const options = [];

		if (results.users.length > 0) {
			const users = { label: 'Users', options: [] };
			results.users.forEach(user => {
				users.options.push({
					type: 'user',
					id: user._id,
					value: 'user' + user._id,
					label: (
						<>
							<UserPic user={user} size={40} /> <span className="userNick">{user.nickname}</span>
						</>
					)
				});
			});

			options.push(users);
		}

		if (results.nfts.length > 0) {
			const nfts = { label: 'Nfts', options: [] };
			results.nfts.forEach(nft => {
				nfts.options.push({
					type: 'nft',
					id: nft._id,
					value: 'nft' + nft._id,
					label: (
						<>
							<img alt={nft.description} src={nft.url} className="nftImage" />{' '}
							<span className="nftTitle">{nft.title}</span>
						</>
					)
				});
			});

			options.push(nfts);
		}

		return options;
	};

	return (
		<>
			<Header className="topbar">
				<Row wrap={false} gutter={16} align="middle">
					<Col flex="none">
						<Link to="/">
							<img src={logo} alt="Trading Virtual Goods" id="logo" />
						</Link>
					</Col>
					<Col flex="auto">
						<GlobalSearch resultParser={parseSearchResults} onSelect={onSearchSelect} />
					</Col>
					<Col flex="none">
						{process.env.NODE_ENV === 'development' && <APICheck />}
						{logged ? (
							<>
								<Link to={'/profile/' + logged._id}>{logged.nickname}</Link>
								<Button type="primary" onClick={() => handleLogout()}>
									{t('login.logout')}
								</Button>
							</>
						) : (
							<Button type="primary" onClick={() => toggleLogin()}>
								{t('login.btn')}
							</Button>
						)}
						{langButtons}
					</Col>
				</Row>
			</Header>
			<Login show={showLogin} handleClose={toggleLogin} />
		</>
	);
};

export default React.memo(HeaderComponent);
