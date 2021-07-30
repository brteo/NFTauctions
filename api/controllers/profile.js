const User = require('../models/user');
const Nft = require('../models/nft');
const { SendData, ServerError, Forbidden, NotFound } = require('../helpers/response');
const { moveTmpFile } = require('../helpers/s3');

const { AWS_S3_BUCKET_DATA, AWS_S3_ENDPOINT_PUBLIC } = process.env;

exports.get = (req, res, next) => {
	User.find({}, (err, users) => {
		if (err) next(ServerError());
		else next(SendData(users));
	});
};

/* Search profiles */
exports.filter = async (req, res, next) => {
	try {
		const users = await User.search(req.params.filter);
		return next(SendData(users));
	} catch (err) {
		return next(ServerError(err));
	}
};

exports.getById = (req, res, next) => {
	User.findById(req.params.id, User.getFields('profile'), (err, user) => {
		if (err || !user) return next(NotFound());
		return next(SendData(user));
	});
};

exports.update = async (req, res, next) => {
	if (res.locals.user.id !== req.params.id) return next(Forbidden());

	if (req.body.pic) {
		try {
			await moveTmpFile(req.body.pic, req.body.pic);
		} catch (err) {
			return next(ServerError(err));
		}

		req.body.pic = AWS_S3_ENDPOINT_PUBLIC + '/' + AWS_S3_BUCKET_DATA + '/' + req.body.pic;
	}

	if (req.body.header) {
		try {
			await moveTmpFile(req.body.header, req.body.header);
		} catch (err) {
			return next(ServerError(err));
		}

		req.body.header = AWS_S3_ENDPOINT_PUBLIC + '/' + AWS_S3_BUCKET_DATA + '/' + req.body.header;
	}

	return User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
		if (err || !user) return next(NotFound());
		return next(SendData(user.response('profile')));
	});
};

/* Get profile nfts */
exports.getCreated = (req, res, next) =>
	Nft.find({ author: req.params.id }, Nft.getFields())
		.populate({ path: 'auction', select: 'price deadline' })
		.populate('author')
		.populate('owner')
		.exec((err, nfts) => {
			if (err) return next(ServerError());
			return next(SendData(nfts));
		});

exports.getOwned = (req, res, next) =>
	Nft.find({ owner: req.params.id }, Nft.getFields())
		.populate({ path: 'auction', select: 'price deadline' })
		.populate('author')
		.populate('owner')
		.exec((err, nfts) => {
			if (err) return next(ServerError());
			return next(SendData(nfts));
		});
