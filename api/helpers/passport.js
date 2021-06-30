const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const moment = require('moment');

const User = require('../models/user');
const {
	WrongEmail,
	WrongPassword,
	ServerError,
	Unauthorized,
	MissingRefreshToken,
	ExpiredRefreshToken,
	AuthReset,
	DeletedAccount,
	InactiveAccount
} = require('./response');

module.exports = passport => {
	passport.use(
		'local',
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password'
			},
			(email, password, done) => {
				User.findOne({ email })
					.then(user => {
						if (!user) return done(WrongEmail());
						if (!user.active) return done(InactiveAccount());
						if (user.deleted) return done(DeletedAccount());
						if (user.authReset) done(AuthReset());

						return user.comparePassword(password, (e, isMatch) => {
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
		'jwt',
		new JwtStrategy(
			{
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
				secretOrKey: process.env.JWT_SECRET
			},
			(jwtPayload, done) => {
				User.findById(jwtPayload.id)
					.then(user => {
						if (user.authReset) done(AuthReset());
						else done(null, user);
					})
					.catch(err => done(Unauthorized()));
			}
		)
	);

	passport.use(
		'jwt-rt',
		new JwtStrategy(
			{
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
				secretOrKey: process.env.RT_SECRET
			},
			async (jwtPayload, done) => {
				User.findById(jwtPayload.userId)
					.then(async user => {
						const found = user.rt.find(rt => rt.token === jwtPayload.rt);
						const valid = found ? moment().isBefore(found.expires) : true;

						if (!found || !valid) {
							// remove all refresh token of user, security issue: someone stole his rt
							user.authReset = moment().format();
							user.rt = [];
							await user.save();
							if (!found) done(MissingRefreshToken());
							else done(ExpiredRefreshToken());
						} else {
							// remove used refresh token
							user.rt = user.rt.filter(rt => rt.token !== jwtPayload.rt);
							await user.save();
							done(null, user);
						}
					})
					.catch(err => done(Unauthorized()));
			}
		)
	);
};
