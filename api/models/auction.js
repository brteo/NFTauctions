const mongoose = require('mongoose');

const schema = new mongoose.Schema(
	{
		title: {
			type: String,
			index: true,
			maxlength: 128,
			required: true
		},
		description: {
			type: String,
			maxlength: 128,
			required: true
		},
		category: {
			type: String,
			maxlength: 128,
			required: true
		},
		tags: {
			type: Array,
			required: true,
			default: []
		},
		image: {
			type: Buffer,
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

module.exports = mongoose.model('Auction', schema);
