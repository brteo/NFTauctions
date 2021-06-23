const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const roles = ['user', 'admin'];

const schema = new mongoose.Schema(
	{
		email: {
			type: String,
			match: /^\S+@\S+\.\S+$/,
			required: true,
			unique: true,
			trim: true,
			lowercase: true
		},
		password: {
			type: String,
			required: true
		},
		name: {
			type: String,
			maxlength: 128,
			index: true,
			trim: true
		},
		lastname: {
			type: String,
			maxlength: 128,
			index: true,
			trim: true
		},
		role: {
			type: String,
			enum: roles,
			default: 'user'
		},
		birthdate: Date,
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

schema.pre('save', async function save(next) {
	try {
		if (!this.isModified('password')) return next();
		this.password = await bcrypt.hash(this.password, 10);

		return next();
	} catch (error) {
		return next(error);
	}
});

schema.methods.comparePassword = (pwd, callback) => {
	bcrypt.compare(pwd, this.password, (err, isMatch) => {
		if (err) return callback(err);
		return callback(null, isMatch);
	});
};

module.exports = mongoose.model('User', schema);
