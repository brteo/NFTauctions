import React from 'react';
import { useTranslation } from 'react-i18next';
import { InboxOutlined, FileImageOutlined } from '@ant-design/icons';

import ImageUploader from '../components/controls/ImageUploader';

const UploadPage = props => {
	const { t } = useTranslation();

	const img = 'http://localhost:4566/data/test.jpg';

	const noCropChange = file => console.log(file);

	const yesCropChange = file => console.log(file);

	return (
		<section>
			<img src={img} alt="test s3" height="200" />
			<br />
			<br />
			<h2>Without crop</h2>
			<ImageUploader onChange={noCropChange} sizeLimit="2">
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
		</section>
	);
};

export default UploadPage;
