const mongoose = require('mongoose');
const softDelete = require('../helpers/softDelete');

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
		}
	},
	{
		timestamps: true
	}
);
schema.plugin(softDelete);

const PUBLIC_FIELDS = ['_id', 'title', 'description', 'category', 'tags', 'image'];

schema.methods.getPublicFields = function () {
	return PUBLIC_FIELDS.reduce((acc, item) => {
		acc[item] = this[item];
		return acc;
	}, {});
};

schema.pre(['find'], function (next) {
	if (!this.selected()) this.select(PUBLIC_FIELDS);
	return next();
});

module.exports = mongoose.model('Auction', schema);
