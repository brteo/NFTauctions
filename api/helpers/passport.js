const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const User = require('../models/User');
const { WrongEmail, WrongPassword, ServerError } = require('../helpers/response');

module.exports = passport => {
	passport.use(
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password'
			},
			(email, password, done) => {
				User.findOne({ email: email })
					.then(user => {
						if (!user) return done(WrongEmail());

						user.comparePassword(password, (e, isMatch) => {
							if (e) return done(ServerError(e));
							if (!isMatch) return done(WrongPassword());

							return done(null, user);
						});
					})
					.catch(err => {
						done(ServerError(err));
					});
			}
		)
	);

	passport.use(
		new JwtStrategy(
			{
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
				secretOrKey: process.env.JWT_SECRET
			},
			(jwtPayload, done) => {
				User.findById(jwtPayload.id)
					.then(user => {
						/* if (user.auth_reset && moment.unix(jwtPayload.iat).isBefore(user.auth_reset)) {
							return done(new MebError({ n: 305 }), false);
						} */

						return done(null, user);
					})
					.catch(err => {
						return done(err);
					});
			}
		)
	);
};
