const passport = require('passport');

const User = require('../models/user');
const { SendData, MissingCredentials, InactiveAccount, DeletedAccount } = require('../helpers/response');

exports.login = (req, res, next) => {
	if (!req.body.email || !req.body.password) return next(MissingCredentials());

	passport.authenticate('local', { session: false }, (err, user) => {
		if (err) return next(err);
		if (!user.active) return next(InactiveAccount());
		if (user.deleted) return next(DeletedAccount());

		/* REFRESH TOKEN */

		const token = jwt.sign(
			{
				id: user.id,
				iat: Math.floor(Date.now() / 1000)
			},
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.JWT_EXPIRES_TIME
			}
		);

		next(SendData({ token }));
	})(req, res, next);
};
