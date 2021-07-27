/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Tabs, Typography, Skeleton, Input, Space, Tooltip, Form } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import Api from '../helpers/api';
import UserHeader from '../components/UserHeader';
import UserPic from '../components/UserPic';
import Nfts from '../components/Nfts';
import AppContext from '../helpers/AppContext';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const Profile = props => {
	const { t } = useTranslation();
	const { logged } = useContext(AppContext);
	const { match } = props;

	const [user, setUser] = useState(null);
	const [bioEditing, setBioEditing] = useState(false);

	const bioInputRef = React.useRef(null);

	useEffect(() => {
		Api.get('/profile/' + match.params.id)
			.then(res => {
				setUser(res.data);
			})
			.catch(err => {
				return err.globalHandler && err.globalHandler();
			});

		return () => {
			setUser(null);
			setBioEditing(false);
		};
	}, [match.params.id]);

	function bioChange({ target: { value } }) {}
	function edit(data) {
		Api.put('/profile/' + match.params.id, data)
			.then(res => {
				setUser(prevState => ({ ...prevState, ...res.data }));
				setBioEditing(false);
			})
			.catch(err => {
				// const errorCode = err.response && err.response.data ? err.response.data.error : null;

				return err.globalHandler && err.globalHandler();
			});
	}

	let page;
	if (user) {
		let { bio } = user;

		if (logged && user._id === logged._id) {
			if (!bio) bio = t('profile.bio_placeholder');

			if (!bioEditing)
				bio = (
					<Paragraph className="userProfileBio">
						{bio}
						<Tooltip title={t('profile.bio_tip')}>
							<EditOutlined onClick={() => setBioEditing(true)} />
						</Tooltip>
					</Paragraph>
				);
			else {
				bio = (
					<>
						<Form id="bioForm" onFinish={edit} initialValues={{ bio: user.bio || '' }}>
							<Form.Item name="bio">
								<TextArea
									ref={bioInputRef}
									autoFocus
									placeholder={t('profile.bio_placeholder')}
									onChange={bioChange}
									autoSize
									bordered={false}
									maxLength={150}
								/>
							</Form.Item>
						</Form>
						<Button form="bioForm" type="primary" htmlType="submit">
							{t('common.save')}
						</Button>
					</>
				);
			}
		}

		page = (
			<>
				<Title level={2}>{user.nickname}</Title>
				{bio}
			</>
		);
	} else {
		page = (
			<div className="profileSkeleton">
				<Skeleton active title={{ width: 180 }} paragraph />
			</div>
		);
	}

	return (
		<section className="userProfilePage">
			<UserHeader user={user} />
			<UserPic user={user} size={110} />
			{page}
			<Tabs defaultActiveKey="created" centered>
				<TabPane tab="Created" key="created">
					<Nfts by="creator" user={user} />
				</TabPane>
				<TabPane tab="Owned" key="owned">
					<Nfts by="owner" user={user} />
				</TabPane>
			</Tabs>
		</section>
	);
};

export default Profile;
