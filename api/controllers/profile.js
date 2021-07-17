const User = require('../models/user');
const { SendData, ServerError, Forbidden, NotFound } = require('../helpers/response');

const profileFields = ['_id', 'nickname', 'pic', 'header', 'bio'];

exports.get = (req, res, next) => {
	User.find({}, (err, users) => {
		if (err) next(ServerError());
		else next(SendData(users));
	});
};

exports.getById = (req, res, next) =>
	User.findById(req.params.id, profileFields, (err, user) => {
		if (err || !user) return next(NotFound());
		return next(SendData(user));
	});

exports.update = (req, res, next) => {
	if (res.locals.user.id !== req.params.id) return next(Forbidden());

	return User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
		if (err || !user) return next(NotFound());
		return next(SendData(user.getFields(Object.keys(req.body))));
	});
};