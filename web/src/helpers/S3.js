/* eslint-disable no-unused-expressions */
import AWS from 'aws-sdk';
import { v1 as uuidv1 } from 'uuid';

const {
	REACT_APP_AWS_ACCESS_KEY_ID,
	REACT_APP_AWS_SECRET_ACCESS_KEY,
	REACT_APP_AWS_S3_BUCKET_NAME,
	REACT_APP_AWS_S3_ENDPOINT
} = process.env;

const s3 = new AWS.S3({
	credentials: {
		accessKeyId: REACT_APP_AWS_ACCESS_KEY_ID,
		secretAccessKey: REACT_APP_AWS_SECRET_ACCESS_KEY
	},
	endpoint: REACT_APP_AWS_S3_ENDPOINT,
	s3ForcePathStyle: true
});

export const generateName = ext => uuidv1({ msecs: new Date().getTime(), nsecs: 5678 }) + '.' + ext;

export const uploadFile = (data, fileName, type, progress = () => {}) =>
	new Promise((resolve, reject) => {
		s3.upload({
			Bucket: REACT_APP_AWS_S3_BUCKET_NAME,
			Key: fileName,
			Body: data,
			ACL: 'public-read',
			ContentType: type || null
		})
			.on('httpUploadProgress', progress)
			.send((err, res) => {
				err ? reject(err) : resolve(res);
			});
	});

export const getFile = fileName =>
	new Promise((resolve, reject) => {
		s3.getObject(
			{
				Bucket: REACT_APP_AWS_S3_BUCKET_NAME,
				Key: fileName
			},
			(err, res) => {
				err ? reject(err) : resolve(res);
			}
		);
	});

export const deleteFile = fileName =>
	new Promise((resolve, reject) => {
		s3.deleteObject(
			{
				Bucket: REACT_APP_AWS_S3_BUCKET_NAME,
				Key: fileName
			},
			(err, res) => {
				err ? reject(err) : resolve(res);
			}
		);
	});

export const getBase64 = file => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
};
