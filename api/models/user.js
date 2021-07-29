const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cryptoJS = require('crypto-js');
const softDelete = require('../helpers/softDelete');
const dbFields = require('../helpers/dbFields');

const { Schema } = mongoose;

const schema = Schema(
	{
		email: {
			type: String,
			match: /^\S+@\S+\.\S+$/,
			required: true,
			unique: true,
			trim: true,
			index: true,
			lowercase: true
		},
		password: {
			type: String,
			required: true
		},
		account: {
			type: String,
			match: /^[a-z1-5.]{1,12}$/,
			maxlength: 12,
			required: true,
			lowercase: true,
			trim: true
		},
		private_key: {
			type: String
		},
		nickname: {
			type: String,
			required: true,
			trim: true
		},
		name: {
			type: String,
			maxlength: 128,
			trim: true
		},
		lastname: {
			type: String,
			maxlength: 128,
			trim: true
		},
		birthdate: Date,
		bio: {
			type: String,
			trim: true
		},
		pic: {
			type: String,
			trim: true
		},
		header: {
			type: String,
			trim: true
		},
		lang: {
			type: String,
			maxlength: 2,
			minlength: 2,
			default: 'en',
			required: true
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user'
		},
		rt: [{ token: String, expires: Date }],
		authReset: Date,
		active: {
			type: Boolean,
			default: false
		}
	},
	{
		timestamps: true
	}
);
schema.plugin(softDelete);
schema.plugin(dbFields, {
	public: ['_id', 'nickname', 'role', 'lang'],
	profile: ['_id', 'nickname', 'pic', 'header', 'bio'],
	cp: ['_id', 'email', 'account', 'nickname', 'name', 'lastname', 'pic', 'lang', 'role', 'active']
});

schema.index({ nickname: 'text' }, { name: 'text' });

schema.pre('save', async function (next) {
	try {
		if (this.isModified('password')) {
			this.password = await bcrypt.hash(this.password, 10);
		}

		if (this.isModified('private_key')) {
			this.private_key = cryptoJS.AES.encrypt(this.private_key, process.env.EOS_SECRET).toString();
		}

		return next();
	} catch (error) {
		return next(error);
	}
});

/* 
Arrow function with 'this'
https://www.codementor.io/@dariogarciamoya/understanding-this-in-javascript-with-arrow-functions-gcpjwfyuc
*/
schema.methods.comparePassword = function (pwd, callback) {
	bcrypt.compare(pwd, this.password, (err, isMatch) => {
		if (err) return callback(err);
		return callback(null, isMatch);
	});
};

schema.methods.getPrivateKey = function () {
	if (!this.private_key) return null;
	return cryptoJS.AES.decrypt(this.private_key, process.env.EOS_SECRET).toString(cryptoJS.enc.Utf8);
};

// cifratura chiave privata di un SEED
/*
const ekey = cryptoJS.AES.encrypt(
	'CHIAVE',
	process.env.EOS_SECRET
).toString();
const dkey = cryptoJS.AES.decrypt(ekey, process.env.EOS_SECRET).toString(cryptoJS.enc.Utf8);
console.log(ekey);
console.log(dkey);
*/

schema.statics.search = function (q) {
	return this.model('User')
		.find({ $text: { $search: q } }, { ...this.model('User').getProjectFields(), ...{ score: { $meta: 'textScore' } } })
		.sort({ score: { $meta: 'textScore' } })
		.exec();
};

/* How to Fix Mongoose Cannot Overwrite Model Once Compiled Error */
module.exports = mongoose.models.User || mongoose.model('User', schema);
