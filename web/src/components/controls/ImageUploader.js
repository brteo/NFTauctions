/* eslint-disable react/jsx-props-no-spreading */
import { Modal, Progress, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sprintf } from 'sprintf-js';
import Api from '../../helpers/api';

const { Dragger } = Upload;

const getBase64 = file => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
};

const ImageUploader = props => {
	const { withCrop, onChange, sizeLimit } = props;

	const { t } = useTranslation();
	const [uploaded, setUploaded] = useState(null);
	const [preview, setPreview] = useState(null);
	const [progress, setProgress] = useState(0);

	const req = ({ file, onError, onSuccess }) => {
		Api.get(`/s3/sign/${file.name.split('.').pop()}`)
			.then(({ data }) => {
				const { url, fileType, fileName, signedRequest } = data;
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

				Api.put(signedRequest, file, options)
					.then(res => {
						setUploaded(url);
						setPreview(null);
						onSuccess(url);
						if (onChange) onChange({ url, fileName, fileType });
					})
					.catch(es3 => {
						setUploaded(null);
						setPreview(null);
						setProgress(0);
						onError();
						if (onChange) onChange(null);
						return es3.globalHandler && es3.globalHandler();
					});
			})
			.catch(e => {
				setUploaded(null);
				setPreview(null);
				setProgress(0);
				onError();
				if (onChange) onChange(null);
				return e.globalHandler && e.globalHandler();
			});
	};

	const changeHandler = async info => {
		if (info.file.status === 'uploading') {
			setUploaded(null);
			setProgress(0);
			if (onChange) onChange(null);
			setPreview(await getBase64(info.file.originFileObj));
		}
	};

	const beforeHandler = file => {
		if (sizeLimit) {
			const isLt2M = file.size / 1024 / 1024 < sizeLimit;
			if (!isLt2M) {
				Modal.error({
					title: t('common.error'),
					content: sprintf(t('core:errors.213'), sizeLimit)
				});
			}
			return isLt2M;
		}
		return true;
	};

	const uploader = (
		<Dragger
			name="file"
			multiple={false}
			maxCount="1"
			accept="image/png, image/gif, image/jpeg"
			itemRender={() => null}
			customRequest={req}
			onChange={changeHandler}
			beforeUpload={beforeHandler}
			className="imageUploader"
		>
			{uploaded || preview ? (
				<div className="imageUploader-preview">
					<div className="imageUploader-preview-box">
						{(uploaded || preview) && (
							<img src={uploaded || preview} alt="Dragger Preview" className={preview && 'imageUploader-uploading'} />
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
				<div className="imageUploader-info">{props.children}</div>
			)}
		</Dragger>
	);

	return withCrop ? <ImgCrop {...withCrop}>{uploader}</ImgCrop> : uploader;
};

export default ImageUploader;
