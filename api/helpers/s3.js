/* eslint-disable no-unused-expressions */
const AWS = require('aws-sdk');
const { v1: uuidv1 } = require('uuid');

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET_DATA, AWS_S3_BUCKET_TMP, AWS_S3_ENDPOINT } =
	process.env;

const s3 = new AWS.S3({
	credentials: {
		accessKeyId: AWS_ACCESS_KEY_ID,
		secretAccessKey: AWS_SECRET_ACCESS_KEY
	},
	endpoint: AWS_S3_ENDPOINT,
	s3ForcePathStyle: true
});

const generateName = ext => uuidv1({ msecs: new Date().getTime(), nsecs: 5678 }) + '.' + ext;

const uploadFile = (data, fileName, type, progress = () => {}) =>
	new Promise((resolve, reject) => {
		s3.upload({
			Bucket: AWS_S3_BUCKET_DATA,
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

const getFile = fileName =>
	new Promise((resolve, reject) => {
		s3.getObject(
			{
				Bucket: AWS_S3_BUCKET_DATA,
				Key: fileName
			},
			(err, res) => {
				err ? reject(err) : resolve(res);
			}
		);
	});

const deleteFile = fileName =>
	new Promise((resolve, reject) => {
		s3.deleteObject(
			{
				Bucket: AWS_S3_BUCKET_DATA,
				Key: fileName
			},
			(err, res) => {
				err ? reject(err) : resolve(res);
			}
		);
	});

const getType = ext => {
	switch (ext) {
		case 'jpg':
		case 'jpeg':
			return 'image/jpeg';
		case 'gif':
			return 'image/gif';
		case 'png':
			return 'image/png';
		case 'pdf':
			return 'application/pdf';
		default:
			return false;
	}
};

const getSign = ext => {
	const fileName = generateName(ext);
	const fileType = getType(ext);

	const s3Params = {
		Bucket: AWS_S3_BUCKET_TMP,
		Key: fileName,
		// Expires: 500, // The date and time at which the object is no longer cacheable.
		ContentType: fileType,
		ACL: 'public-read'
	};

	return new Promise((resolve, reject) => {
		s3.getSignedUrl('putObject', s3Params, (err, data) => {
			if (err) return reject(err);
			return resolve({
				signedRequest: data,
				url: AWS_S3_ENDPOINT + '/' + AWS_S3_BUCKET_TMP + '/' + fileName,
				fileType,
				fileName
			});
		});
	});
};

module.exports = {
	generateName,
	uploadFile,
	getFile,
	deleteFile,
	getSign
};
