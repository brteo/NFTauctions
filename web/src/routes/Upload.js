/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Modal, Image, Progress } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { sprintf } from 'sprintf-js';

import { uploadFile, deleteFile, generateName, getBase64 } from '../helpers/S3';

const { Dragger } = Upload;

const UploadPage = props => {
	const { t } = useTranslation();
	const [uploaded, setUploaded] = useState(null);
	const [preview, setPreview] = useState(null);
	const [progress, setProgress] = useState(0);

	const img = 'http://localhost:4566/data/test.jpg';

	const req = ({ file, onError, onSuccess, onProgress }) =>
		uploadFile(file, generateName(file.name.split('.').pop()), file.type, ({ loaded, total }) => {
			setProgress(Math.round((loaded / total) * 100));
		})
			.then(res => {
				setUploaded(res);
				onSuccess(res);
			})
			.catch(res => {
				Modal.error({
					title: t('common.error'),
					content: (
						<>
							{t('core:errors.212')}
							<br />
							<br />
							{res.message}
						</>
					)
				});
				setPreview(null);
				setProgress(0);
				onError();
			});

	const removeHandler = file => deleteFile(file.response.Key).then(res => setUploaded(null));

	const changeHandler = async info => {
		if (info.file.status === 'uploading') {
			setUploaded(null);
			setPreview(await getBase64(info.file.originFileObj));
		}
	};

	const beforeHandler = file => {
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			Modal.error({
				title: t('common.error'),
				content: sprintf(t('core:errors.213'), 2)
			});
		}
		return isLt2M;
	};

	return (
		<section>
			<img src={img} alt="test s3" height="200" />
			<br />
			<br />
			<ImgCrop aspect={4 / 3} quality={0.8}>
				<Dragger
					name="file"
					multiple={false}
					maxCount="1"
					accept="image/png, image/gif, image/jpeg"
					itemRender={() => null}
					customRequest={req}
					onRemove={removeHandler}
					onChange={changeHandler}
					beforeUpload={beforeHandler}
				>
					{uploaded || preview ? (
						<>
							<img height="200" src={uploaded ? uploaded.Location : preview} alt="Dragger Preview" />
							<Progress percent={progress} />
						</>
					) : (
						<>
							<p className="ant-upload-drag-icon">
								<InboxOutlined />
							</p>
							<p className="ant-upload-text">Click or drag file to this area to upload</p>
							<p className="ant-upload-hint">
								Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files
							</p>
						</>
					)}
				</Dragger>
			</ImgCrop>
		</section>
	);
};

export default UploadPage;
