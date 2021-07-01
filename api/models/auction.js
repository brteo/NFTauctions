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
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
			required: true
		},
		tags: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Tag',
				required: true
			}
		],
		image: {
			type: String,
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
