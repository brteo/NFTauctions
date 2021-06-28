const mongoose = require('mongoose');

const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			index: true,
			maxlength: 128,
			required: true
		},
		active: {
			type: Boolean,
			default: true
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

module.exports = mongoose.model('Category', schema);
