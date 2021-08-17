import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InboxOutlined, FileImageOutlined, CameraOutlined } from '@ant-design/icons';

import ImageUploader from '../components/controls/ImageUploader';

const UploadPage = props => {
	const { t } = useTranslation();

	const img = 'http://localhost:4566/data/test.jpg';

	const [picUploaded, setPicUploaded] = useState(null);
	const onUploadedMoveTheFileToNewUrl = data => setPicUploaded(img);

	const onUpload = file => console.log(file);

	const yesCropChange = file => console.log(file);

	return (
		<section>
			<img src={img} alt="test s3" height="200" />
			<br />
			<br />
			<h2>Standard with overlay Icon</h2>
			<ImageUploader onChange={onUpload} sizeLimit="2" overlay={<CameraOutlined />} />
			<br />
			<br />
			<h2>With custom children</h2>
			<ImageUploader onChange={onUpload} sizeLimit="2">
				<p className="ant-upload-drag-icon">
					<InboxOutlined />
				</p>
				<p className="ant-upload-text">{t('core:imageUploader.text')}</p>
				<p className="ant-upload-hint">{t('core:imageUploader.opt')}</p>
			</ImageUploader>
			<br />
			<br />
			<h2>With crop</h2>
			<ImageUploader
				withCrop={{ aspect: 4 / 3, quality: 0.8, modalTitle: t('core:imageUploader.crop') }}
				onChange={yesCropChange}
			>
				<p className="ant-upload-drag-icon">
					<FileImageOutlined />
				</p>
				<p className="ant-upload-text">{t('core:imageUploader.text')}</p>
				<p className="ant-upload-hint">{t('core:imageUploader.opt')}</p>
			</ImageUploader>
			<h2>With init image</h2>
			<ImageUploader onChange={onUpload} sizeLimit="2" initImage={img}>
				<p className="ant-upload-drag-icon">
					<InboxOutlined />
				</p>
				<p className="ant-upload-text">{t('core:imageUploader.text')}</p>
				<p className="ant-upload-hint">{t('core:imageUploader.opt')}</p>
			</ImageUploader>
			<br />
			<br />
			<h2>With cover image</h2>
			<ImageUploader onChange={onUpload} sizeLimit="2" cover initImage={img}>
				<p className="ant-upload-drag-icon">
					<InboxOutlined />
				</p>
				<p className="ant-upload-text">{t('core:imageUploader.text')}</p>
				<p className="ant-upload-hint">{t('core:imageUploader.opt')}</p>
			</ImageUploader>
			<br />
			<br />
			<h2>With init uploaded image</h2>
			<ImageUploader onChange={onUpload} sizeLimit="2" cover initUploadImage={img}>
				<p className="ant-upload-drag-icon">
					<InboxOutlined />
				</p>
				<p className="ant-upload-text">{t('core:imageUploader.text')}</p>
				<p className="ant-upload-hint">{t('core:imageUploader.opt')}</p>
			</ImageUploader>
			<br />
			<br />
			<h2>With skipSetUploaded - image updated with initUploadImage after moved by parent</h2>
			<ImageUploader
				onChange={onUploadedMoveTheFileToNewUrl}
				sizeLimit="2"
				cover
				skipSetUploaded
				initUploadImage={picUploaded}
			>
				<p className="ant-upload-drag-icon">
					<InboxOutlined />
				</p>
				<p className="ant-upload-text">{t('core:imageUploader.text')}</p>
				<p className="ant-upload-hint">{t('core:imageUploader.opt')}</p>
			</ImageUploader>
		</section>
	);
};

export default UploadPage;
