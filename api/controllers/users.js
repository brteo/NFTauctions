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

	return User.findById(req.params.id, User.getFields('cp'), (err, user) => {
		if (err || !user) return next(NotFound());
		return next(SendData(user));
	});
};

exports.update = (req, res, next) => {
	if (res.locals.grants.type !== 'any' && res.locals.user.id !== req.params.id) return next(Forbidden());

	return User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
		if (err || !user) return next(NotFound());
		return next(SendData(user.response('cp')));
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

exports.getPic = (req, res, next) =>
	User.findById(req.params.id, (err, user) => {
		if (err || !user || !user.pic) return next(NotFound());
		return next(SendData(user.pic));
	});
