const passport = require('passport');
const { Unauthorized } = require('../helpers/response');

module.exports = (req, res, next) =>
	passport.authenticate('jwt', { session: false }, (err, user) => {
		if (user) {
			res.locals.user = user;
			return next();
		}
		return next(Unauthorized());
	})(req, res, next);
