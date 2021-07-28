const User = require('../models/user');
const Nft = require('../models/nft');
const { SendData, ServerError, Forbidden, NotFound } = require('../helpers/response');

exports.get = (req, res, next) => {
	User.find({}, (err, users) => {
		if (err) next(ServerError());
		else next(SendData(users));
	});
};

/* Search profiles */
exports.filter = (req, res, next) => {
	User.find({ $text: { $search: req.params.filter } }, { score: { $meta: 'textScore' } })
		.sort({ score: { $meta: 'textScore' } })
		.exec((err, users) => {
			if (err) return next(ServerError(err));
			return next(SendData(users));
		});
};

exports.getById = (req, res, next) => {
	User.findById(req.params.id, User.getFields('profile'), (err, user) => {
		if (err || !user) return next(NotFound());
		return next(SendData(user));
	});
};

exports.update = (req, res, next) => {
	if (res.locals.user.id !== req.params.id) return next(Forbidden());

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
