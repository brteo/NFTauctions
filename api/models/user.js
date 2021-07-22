const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cryptoJS = require('crypto-js');
const softDelete = require('../helpers/softDelete');
const publicFields = require('../helpers/publicFields');

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
schema.plugin(publicFields, ['_id', 'nickname', 'role']);

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

/* How to Fix Mongoose Cannot Overwrite Model Once Compiled Error */
module.exports = mongoose.models.User || mongoose.model('User', schema);
