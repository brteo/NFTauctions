/* eslint-disable react/jsx-props-no-spreading */
import { Modal, Progress, Upload } from 'antd';
import axios from 'axios';
import ImgCrop from 'antd-img-crop';
import React, { useState, useEffect } from 'react';
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

let cancelTokenSource;

const ImageUploader = props => {
	const {
		className,
		onChange,
		initImage,
		initUploadImage,
		skipSetUploaded,
		overlay,
		withCrop,
		cover,
		sizeLimit,
		progressSize
	} = props;

	const { t } = useTranslation();

	const [uploaded, setUploaded] = useState(initUploadImage || null);
	const [preview, setPreview] = useState(null);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		setUploaded(initUploadImage);
	}, [initUploadImage]);

	const req = async ({ file, onError, onSuccess }) => {
		if (cancelTokenSource) cancelTokenSource.cancel();

		setUploaded(null);
		setProgress(0);
		if (onChange) onChange(null);
		setPreview(await getBase64(file));

		Api.get(`/s3/sign/${file.name.split('.').pop()}`)
			.then(({ data }) => {
				cancelTokenSource = axios.CancelToken.source();

				const { url, fileType, fileName, signedRequest } = data;
				const options = {
					cancelToken: cancelTokenSource.token,
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
					.then(async res => {
						cancelTokenSource = null;
						// let newUrl = url;
						// if (moveOnUpload) newUrl = await moveOnUpload({ url, fileName, fileType });

						if (!skipSetUploaded) setUploaded(url);
						// setPreview(null); è da togliere solo dopo che la upload image è caricata
						onSuccess(url);
						if (onChange) onChange({ url, fileName, fileType });
					})
					.catch(es3 => {
						setUploaded(null);
						setPreview(null);
						setProgress(0);
						if (onChange) onChange(null);

						if (axios.isCancel(es3)) return;
						onError();

						if (es3.globalHandler) es3.globalHandler();
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

	const progSize = progressSize || { uploaded: 40, default: 100 };

	const previewCovers = [];
	if (cover) {
		if (!uploaded && initImage)
			previewCovers.push(
				<div
					key="cover3"
					className="imageUploader-cover bg-cover"
					style={{ backgroundImage: "url('" + initImage + "')" }}
				/>
			);
		if (preview)
			previewCovers.push(
				<div
					key="cover2"
					className="imageUploader-cover bg-cover"
					style={{ backgroundImage: "url('" + preview + "')" }}
				/>
			);
		if (uploaded)
			previewCovers.push(
				<div
					key="cover1"
					className="imageUploader-cover bg-cover"
					style={{ backgroundImage: "url('" + uploaded + "')" }}
				/>
			);
	}

	const uploader = (
		<Dragger
			name="file"
			multiple={false}
			maxCount="1"
			accept="image/png, image/gif, image/jpeg"
			itemRender={() => null}
			customRequest={req}
			beforeUpload={beforeHandler}
			className={'imageUploader' + (className ? ' ' + className : '')}
		>
			{overlay && <div className="imageUploader-overlay">{overlay}</div>}
			<div className="imageUploader-content">
				{uploaded || preview || initImage ? (
					<div className="imageUploader-preview">
						{cover && previewCovers}
						{!cover && (uploaded || preview || initImage) && (
							<img
								src={uploaded || preview || initImage}
								alt="Dragger Preview"
								className={preview && 'imageUploader-uploading'}
							/>
						)}
						{(uploaded || preview) && (
							<Progress
								type="circle"
								percent={progress}
								className={uploaded ? 'progress-done' : ''}
								width={uploaded ? progSize.uploaded : progSize.default}
							/>
						)}
					</div>
				) : (
					<div className="imageUploader-info">{props.children}</div>
				)}
			</div>
		</Dragger>
	);

	return withCrop ? <ImgCrop {...withCrop}>{uploader}</ImgCrop> : uploader;
};

export default React.memo(ImageUploader);
