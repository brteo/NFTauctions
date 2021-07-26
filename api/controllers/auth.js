const passport = require('passport');

const User = require('../models/user');
const {
	SendData,
	ServerError,
	NotFound,
	EmailAlreadyExists,
	AccountAlreadyExists,
	NicknameAlreadyExists
} = require('../helpers/response');
const { generateToken } = require('../helpers/auth');
const { eos, generateKeys } = require('../helpers/eosjs');
const { registerEmail } = require('../emails');

exports.login = (req, res, next) =>
	passport.authenticate('local', { session: false }, async (err, user) => {
		if (err) return next(err);

		try {
			await generateToken(res, user);

			return next(SendData(user.response()));
		} catch (e) {
			return next(ServerError(e));
		}
	})(req, res, next);

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
	const langs = ['it', 'en'];
	const defaultLang = 'en';

	if (req.body.lang && !langs.includes(req.body.lang)) {
		req.body.lang = defaultLang;
	}

	try {
		const check = await User.findOne({ email: req.body.email }).exec();
		if (check) return next(EmailAlreadyExists());
	} catch (e) {
		return next(ServerError(e));
	}

	try {
		const check = await User.findOne({ nickname: req.body.nickname }).exec();
		if (check) return next(NicknameAlreadyExists());
	} catch (e) {
		return next(ServerError(e));
	}

	try {
		const check = await User.findOne({ account: req.body.account }).exec();
		if (check) return next(AccountAlreadyExists());
	} catch (e) {
		return next(ServerError(e));
	}

	try {
		const keys = generateKeys();
		req.body.private_key = keys.private;

		await eos.transact(
			{
				actions: [
					{
						account: 'eosio',
						name: 'newaccount',
						authorization: [
							{
								actor: 'mebtradingvg',
								permission: 'active'
							}
						],
						data: {
							creator: 'mebtradingvg',
							name: req.body.account,
							owner: {
								threshold: 1,
								keys: [
									{
										key: keys.public,
										weight: 1
									}
								],
								accounts: [],
								waits: []
							},
							active: {
								threshold: 1,
								keys: [
									{
										key: keys.public,
										weight: 1
									}
								],
								accounts: [],
								waits: []
							}
						}
					}
				]
			},
			{
				blocksBehind: 3,
				expireSeconds: 30
			}
		);
	} catch (e) {
		if (e.json && e.json.error.code === 3050001) return next(AccountAlreadyExists());
		return next(ServerError(e));
	}

	req.body.active = true;
	return new User(req.body).save(async (err, user) => {
		if (err) return next(ServerError());

		try {
			await generateToken(res, user);

			registerEmail(user.email, user.lang, user.nickname).catch(erremail => console.log('[EMAIL ERROR]', erremail));

			return next(SendData(user.response()));
		} catch (e) {
			return next(ServerError(e));
		}
	});
};

exports.refreshToken = async (req, res, next) => {
	try {
		await generateToken(res, res.locals.user);

		return next(SendData(res.locals.user.response()));
	} catch (e) {
		return next(ServerError(e));
	}
};

exports.logout = async (req, res, next) => {
	res.clearCookie('TvgAccessToken', {
		httpOnly: true,
		sameSite: 'strict',
		path: '/'
	});
	res.clearCookie('TvgRefreshToken', {
		httpOnly: true,
		sameSite: 'strict',
		path: '/'
	});
	next(SendData({ message: 'Logout succesfully!' }));
};
