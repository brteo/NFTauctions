import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Tabs, Typography, Skeleton, Input, Tooltip, Form } from 'antd';
import { EditOutlined, CameraOutlined, UserOutlined } from '@ant-design/icons';

import Api from '../helpers/api';
import ImageUploader from '../components/controls/ImageUploader';
import UserHeader from '../components/UserHeader';
import UserPic from '../components/UserPic';
import Nfts from '../components/Nfts';
import AppContext from '../helpers/AppContext';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const Profile = props => {
	const { t } = useTranslation();
	const { logged, setLogged } = useContext(AppContext);
	const { match } = props;

	const [user, setUser] = useState(null);
	const [bioEditing, setBioEditing] = useState(false);
	const [picUploaded, setPicUploaded] = useState(null);
	const [headerUploaded, setHeaderUploaded] = useState(null);

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
				setLogged(prevState => ({ ...prevState, ...res.data }));
				setBioEditing(false);
				if (res.data.pic) setPicUploaded(res.data.pic);
				if (res.data.header) setHeaderUploaded(res.data.header);
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

	const headerUploadedHandler = v => v && edit({ header: v.fileName });
	const picUploadedHandler = v => v && edit({ pic: v.fileName });

	return (
		<section className="userProfilePage">
			{user && logged && user._id === logged._id ? (
				<>
					<ImageUploader
						onChange={headerUploadedHandler}
						skipSetUploaded
						sizeLimit="2"
						overlay={
							<Tooltip title={t('profile.header_tip')}>
								<CameraOutlined />
							</Tooltip>
						}
						cover
						initImage={user.header}
						initUploadImage={headerUploaded}
						className="header-uploader"
					/>
					<ImageUploader
						onChange={picUploadedHandler}
						skipSetUploaded
						sizeLimit="2"
						overlay={
							<Tooltip title={t('profile.pic_tip')}>
								<CameraOutlined />
							</Tooltip>
						}
						initImage={user.pic}
						initUploadImage={picUploaded}
						className="userPic-uploader"
						withCrop={{ aspect: 1, quality: 0.85, modalTitle: t('core:imageUploader.crop') }}
					>
						<UserOutlined />
					</ImageUploader>
				</>
			) : (
				<>
					<UserHeader user={user} />
					<UserPic user={user} size={110} />
				</>
			)}

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
