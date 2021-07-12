const passport = require('passport');
const { Unauthorized } = require('../helpers/response');

exports.isAuth = (req, res, next) =>
	passport.authenticate('jwt', { session: false }, (err, user) => {
		if (err) return next(err);
		if (user) {
			res.locals.user = user;
			return next();
		}
		return next(Unauthorized());
	})(req, res, next);

exports.isAuthRt = (req, res, next) =>
	passport.authenticate('jwt-rt', { session: false }, (err, user) => {
		if (err) return next(err);
		if (user) {
			res.locals.user = user;
			return next();
		}
		return next(Unauthorized());
	})(req, res, next);

exports.isAuthRtlogout = (req, res, next) =>
	passport.authenticate('jwt-rt', { session: false }, (err, user) => {
		if (user) res.locals.user = user;
		return next();
	})(req, res, next);
