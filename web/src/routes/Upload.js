/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Modal, Progress } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { sprintf } from 'sprintf-js';

import { connect } from '../helpers/api';

const { Dragger } = Upload;

const getBase64 = file => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
};

const UploadPage = props => {
	const { t } = useTranslation();
	const [uploaded, setUploaded] = useState(null);
	const [preview, setPreview] = useState(null);
	const [progress, setProgress] = useState(0);

	const img = 'http://localhost:4566/data/test.jpg';

	const req = ({ file, onError, onSuccess }) => {
		connect
			.get(`/s3/sign/${file.name.split('.').pop()}`)
			.then(({ data }) => {
				const { url, fileType, signedRequest } = data;
				const options = {
					withCredentials: false,
					headers: {
						'Content-Type': fileType
					},
					onUploadProgress: event => {
						const percent = Math.floor((event.loaded / event.total) * 100);
						setProgress(percent);
					}
				};

				connect
					.put(signedRequest, file, options)
					.then(res => {
						setUploaded(url);
						setPreview(null);
						onSuccess(url);
					})
					.catch(es3 => {
						setPreview(null);
						setUploaded(null);
						setProgress(0);
						onError();
						return es3.globalHandler && es3.globalHandler();
					});
			})
			.catch(e => {
				setPreview(null);
				setUploaded(null);
				setProgress(0);
				onError();
				return e.globalHandler && e.globalHandler();
			});
	};

	const changeHandler = async info => {
		if (info.file.status === 'uploading') {
			setUploaded(null);
			setProgress(0);
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
			<div className="imageUploader">
				<ImgCrop aspect={4 / 3} quality={0.8}>
					<Dragger
						name="file"
						multiple={false}
						maxCount="1"
						accept="image/png, image/gif, image/jpeg"
						itemRender={() => null}
						customRequest={req}
						onChange={changeHandler}
						beforeUpload={beforeHandler}
					>
						{uploaded || preview ? (
							<div className="imageUploader-preview">
								<div className="imageUploader-preview-box">
									{(uploaded || preview) && (
										<img
											src={uploaded || preview}
											alt="Dragger Preview"
											className={preview && 'imageUploader-uploading'}
										/>
									)}
									<Progress
										type="circle"
										percent={progress}
										className={uploaded ? 'progress-done' : ''}
										width={uploaded ? 40 : 100}
									/>
								</div>
							</div>
						) : (
							<div className="imageUploader-info">
								<p className="ant-upload-drag-icon">
									<InboxOutlined />
								</p>
								<p className="ant-upload-text">Click or drag file to this area to upload</p>
								<p className="ant-upload-hint">
									Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files
								</p>
							</div>
						)}
					</Dragger>
				</ImgCrop>
			</div>
		</section>
	);
};

export default UploadPage;
