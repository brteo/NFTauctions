const passport = require('passport');
const User = require('../models/user');
const { SendData, MissingCredentials, ServerError, NotFound, EmailAlreadyExists } = require('../helpers/response');
const { genereteAuthToken, genereteRefreshToken } = require('../helpers/auth');

exports.login = (req, res, next) => {
	if (!req.body.email || !req.body.password) return next(MissingCredentials());

	return passport.authenticate('local', { session: false }, async (err, user) => {
		if (err) return next(err);

		try {
			const token = genereteAuthToken(user);
			const rt = await genereteRefreshToken(user);
			return next(SendData({ token, rt }));
		} catch (e) {
			return next(ServerError(e));
		}
	})(req, res, next);
};

exports.check = (req, res, next) => {
	next(SendData({ id: res.locals.user.id, message: 'Token is valid!' }));
};

exports.checkIfEmailExists = (req, res, next) => {
	User.findOne({ email: req.params.email }, (err, user) => {
		if (err) return next(ServerError());
		if (!user) return next(NotFound());
		return next(SendData({ message: 'Email exists!' }));
	});
};

exports.register = async (req, res, next) => {
	try {
		const check = await User.findOne({ email: req.body.email }).exec();
		if (check) return next(EmailAlreadyExists());
	} catch (e) {
		return next(ServerError());
	}

	return new User(req.body).save(async (err, user) => {
		if (err) return next(ServerError());

		try {
			const token = genereteAuthToken(user);
			const rt = await genereteRefreshToken(user);
			return next(SendData({ token, rt }));
		} catch (e) {
			return next(ServerError(e));
		}
	});
};

exports.refreshToken = async (req, res, next) => {
	try {
		const token = genereteAuthToken(res.locals.user);
		const rt = await genereteRefreshToken(res.locals.user);
		return next(SendData({ token, rt }));
	} catch (e) {
		return next(ServerError(e));
	}
};

exports.logout = async (req, res, next) => {
	next(SendData({ message: 'Logout succesfully!' }));
};
