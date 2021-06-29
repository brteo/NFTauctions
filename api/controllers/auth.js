/* eslint-disable consistent-return */
const User = require('../models/user');
const {
	SendData,
	MissingCredentials,
	WrongEmail,
	WrongPassword,
	InactiveAccount,
	DeletedAccount,
	ServerError
} = require('../helpers/response');

exports.login = (req, res, next) => {
	if (!req.body.email || !req.body.password) return next(MissingCredentials());

	User.findOne({ email: req.body.email }, (err, user) => {
		if (err || !user) return next(WrongEmail());

		user.comparePassword(req.body.password, (e, isMatch) => {
			if (e) return next(ServerError());
			if (!isMatch) return next(WrongPassword());
			if (!user.active) return next(InactiveAccount());
			if (user.deleted) return next(DeletedAccount());
			return next(SendData(user));
		});
	});
};
