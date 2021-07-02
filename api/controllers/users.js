const User = require('../models/user');
const { SendData, ServerError, Forbidden, NotFound } = require('../helpers/response');

exports.get = (req, res, next) => {
	User.find({}, (err, users) => {
		if (err) next(ServerError());
		else next(SendData(users));
	});
};

exports.getById = (req, res, next) => {
	if (res.locals.grants.type !== 'any' && res.locals.user.id !== req.params.id) return next(Forbidden());

	return User.findById(req.params.id, (err, user) => {
		if (err || !user) return next(NotFound());
		return next(SendData(user.getPublicFields()));
	});
};

exports.add = (req, res, next) => {
	new User(req.body).save((err, user) => {
		if (err) next(ServerError());
		else next(SendData(user.getPublicFields(), 201));
	});
};

exports.update = (req, res, next) => {
	if (res.locals.grants.type !== 'any' && res.locals.user.id !== req.params.id) return next(Forbidden());

	return User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
		if (err || !user) return next(NotFound());
		return next(SendData(user.getPublicFields()));
	});
};

exports.delete = (req, res, next) => {
	if (res.locals.grants.type !== 'any' && res.locals.user.id !== req.params.id) return next(Forbidden());

	return User.findById(req.params.id, async (err, user) => {
		if (err || !user) return next(NotFound());
		await user.softdelete();
		return next(SendData({ message: 'User deleted sucessfully!' }));
	});
};
