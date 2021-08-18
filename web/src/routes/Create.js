import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
	Divider,
	Typography,
	DatePicker,
	Select,
	InputNumber,
	Checkbox,
	Button,
	Form,
	Input,
	Row,
	Col,
	Tag
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import moment from 'moment';
import { sprintf } from 'sprintf-js';

import AppContext from '../helpers/AppContext';
import Api from '../helpers/api';
import ImageUploader from '../components/controls/ImageUploader';

const { Title } = Typography;
const { REACT_APP_CURRENCY } = process.env;

const Create = props => {
	const { t, i18n } = useTranslation();
	const { logged } = useContext(AppContext);

	const [form] = Form.useForm();
	const history = useHistory();

	const [send, setSend] = useState(false);
	const [deadlineError, setDeadlineError] = useState(false);
	const [privacyError, setPrivacyError] = useState(false);
	const [categories, setCategories] = useState(null);
	const [tags, setTags] = useState(null);

	const { language } = i18n;

	if (!logged) {
		return window.location.replace(window.location.origin);
	}

	useEffect(() => {
		Api.get(`categories`)
			.then(res => setCategories(res.data))
			.catch(err => err.globalHandler && err.globalHandler());
		Api.get(`tags`)
			.then(res => setTags(res.data))
			.catch(err => err.globalHandler && err.globalHandler());

		return () => {
			form.resetFields();
			setSend(false);
			setCategories(null);
			setTags(null);
			setDeadlineError(false);
			setPrivacyError(false);
		};
	}, []);

	const handleSubmitComplete = nftId => {
		setSend(false);
		history.push('/nft/' + nftId);
	};

	const handleSubmit = data => {
		if (!data.privacy) {
			return setPrivacyError(t('core:errors.201'));
		}
		if (data.auctionPrice && moment().isAfter(data.auctionDeadline)) {
			return setDeadlineError(t('core:errors.216'));
		}

		setSend(true);

		const newNft = {
			title: data.title,
			description: data.description,
			category: {
				id: data.category
			},
			tags: data.tags,
			url: data.url.fileName
		};

		let newAuction = null;
		if (data.auctionPrice) {
			newAuction = {
				description: data.auctionDescription,
				basePrice: data.auctionPrice,
				deadline: data.auctionDeadline.format('YYYY-MM-DD HH:mm') + ':00'
			};
		}

		return Api.post(`/nfts`, newNft)
			.then(res => {
				const nftId = res.data._id;

				if (newAuction) {
					newAuction.nft = Number(nftId);

					Api.post(`/auctions`, newAuction)
						.then(() => handleSubmitComplete(nftId))
						.catch(err => {
							setSend(false);
							return err.globalHandler && err.globalHandler();
						});
				} else {
					handleSubmitComplete(nftId);
				}
			})
			.catch(err => {
				setSend(false);
				return err.globalHandler && err.globalHandler();
			});
	};

	const validateMessages = { required: t('core:errors.201') };

	const descriptionLabel = () => {
		const opt = sprintf(t('create.fields.max'), '256');
		return (
			<>
				{t('create.fields.description')}
				<span className="opt">({opt})</span>
			</>
		);
	};

	return (
		<section className="padded-content create-page">
			<Title level={1}>{t('create.title')}</Title>
			<Form
				id="createForm"
				form={form}
				layout="vertical"
				validateMessages={validateMessages}
				onFinish={handleSubmit}
				initialValues={{
					auctionDeadline: moment().add(7, 'days')
				}}
			>
				<Divider orientation="left">
					<Tag>1</Tag> {t('create.info')}
				</Divider>
				<Row gutter={{ xs: 8, md: 16 }}>
					<Col xs={24}>
						<Form.Item
							name="title"
							label={t('create.fields.title')}
							rules={[
								{
									required: true
								}
							]}
						>
							<Input />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							name="url"
							label={t('create.fields.image')}
							rules={[
								{
									required: true
								}
							]}
						>
							<ImageUploader sizeLimit="5">
								<p className="ant-upload-drag-icon">
									<InboxOutlined />
								</p>
								<p className="ant-upload-text">{t('core:imageUploader.text')}</p>
								<p className="ant-upload-hint">{t('core:imageUploader.opt')}</p>
							</ImageUploader>
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							name="description"
							label={descriptionLabel()}
							rules={[
								{
									required: true
								}
							]}
						>
							<Input.TextArea rows={6} maxLength="256" showCount />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name="category"
							label={t('create.fields.category')}
							rules={[
								{
									required: true
								}
							]}
						>
							<Select disabled={!categories} loading={!categories}>
								{categories &&
									categories.map(item => (
										<Select.Option key={item._id} value={item._id}>
											{item.name[language]}
										</Select.Option>
									))}
							</Select>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name="tags" label={t('create.fields.tags')}>
							<Select mode="tags" disabled={!tags} loading={!tags}>
								{tags &&
									tags.map(item => (
										<Select.Option key={item._id} value={item.name}>
											{item.name}
										</Select.Option>
									))}
							</Select>
						</Form.Item>
					</Col>
				</Row>
				<Divider orientation="left">
					<Tag>2</Tag> {t('create.auction')} <span className="opt">({t('create.optional')})</span>
				</Divider>
				<p>{t('create.auction_text')}</p>
				<Row gutter={{ xs: 8, md: 16 }}>
					<Col xs={24} md={12}>
						<Form.Item name="auctionPrice" label={t('create.fields.price')}>
							<InputNumber
								formatter={value => `${REACT_APP_CURRENCY} ${value}`}
								parser={value => value.replace(REACT_APP_CURRENCY + ' ', '')}
								min={0.01}
								precision={2}
								step={0.01}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name="auctionDeadline"
							label={t('create.fields.deadline')}
							validateStatus={deadlineError ? 'error' : undefined}
							help={deadlineError || undefined}
							onChange={() => setDeadlineError(false)}
						>
							<DatePicker format={t('core:fields.datetime')} showTime={{ format: t('core:fields.datetime') }} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name="auctionDescription" label={t('create.fields.description')}>
							<Input.TextArea rows={6} />
						</Form.Item>
					</Col>
				</Row>
				<Divider orientation="left" plain>
					<Tag>3</Tag> {t('create.confirm')}
				</Divider>
				<Row gutter={{ xs: 8, md: 16 }}>
					<Col xs={24}>
						<Form.Item
							name="privacy"
							valuePropName="checked"
							validateStatus={privacyError ? 'error' : undefined}
							help={privacyError || undefined}
							onChange={() => setPrivacyError(false)}
							rules={[
								{
									required: true
								}
							]}
						>
							<Checkbox>{t('create.check')}</Checkbox>
						</Form.Item>
					</Col>
					<Col xs={24} className="align-center">
						<Button type="primary" htmlType="submit" size="large" disabled={send} loading={send}>
							{t('create.btn')}
						</Button>
					</Col>
				</Row>
			</Form>
		</section>
	);
};

export default Create;
