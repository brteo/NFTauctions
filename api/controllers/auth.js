const passport = require('passport');

const { SendData, MissingCredentials, ServerError } = require('../helpers/response');
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
