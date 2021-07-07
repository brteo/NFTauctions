const jwt = require('jsonwebtoken');
const { v1: uuidv1 } = require('uuid');
const moment = require('moment');

const genereteAuthToken = user => {
	const token = jwt.sign(
		{
			id: user.id,
			iat: Math.floor(Date.now() / 1000)
		},
		process.env.JWT_SECRET,
		{ expiresIn: parseInt(process.env.JWT_EXPIRES_TIME) }
	);

	return { token, expires: moment().add(process.env.JWT_EXPIRES_TIME, 's').format() };
};

const genereteRefreshToken = async user => {
	const uuid = uuidv1(); // Create a version 1 (timestamp) UUID
	const rt = jwt.sign(
		{
			userId: user.id,
			rt: uuid,
			iat: Math.floor(Date.now() / 1000)
		},
		process.env.RT_SECRET,
		{ expiresIn: parseInt(process.env.RT_EXPIRES_TIME) }
	);

	user.rt.push({ token: uuid, expires: moment().add(process.env.RT_EXPIRES_TIME, 's').format() });
	await user.save();

	return { rt, expires: moment().add(process.env.RT_EXPIRES_TIME, 's').format() };
};

const generateToken = async (res, user) => {
	const { token, expires: tokenExpires } = genereteAuthToken(user);
	const { rt, expires: rtExpires } = await genereteRefreshToken(user);

	res.cookie('TvgAccessToken', token, {
		httpOnly: true,
		expires: new Date(tokenExpires),
		sameSite: 'strict',
		path: '/'
	});
	res.cookie('TvgRefreshToken', rt, {
		httpOnly: true,
		expires: new Date(rtExpires),
		sameSite: 'strict',
		path: '/'
	});
};

module.exports = { genereteAuthToken, genereteRefreshToken, generateToken };
