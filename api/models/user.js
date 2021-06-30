const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const roles = ['user', 'admin'];

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
			enum: roles,
			default: 'user'
		},
		rt: [{ token: String, expires: Date }],
		authReset: Date,
		active: {
			type: Boolean,
			default: false
		},
		deleted: {
			type: Boolean,
			default: false
		}
	},
	{
		timestamps: true
	}
);

schema.pre('save', async function (next) {
	try {
		if (this.isModified('password')) {
			this.password = await bcrypt.hash(this.password, 10);
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

/* How to Fix Mongoose Cannot Overwrite Model Once Compiled Error */
module.exports = mongoose.models.User || mongoose.model('User', schema);
