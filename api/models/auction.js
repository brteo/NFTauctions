const mongoose = require('mongoose');
const softDelete = require('../helpers/softDelete');

const { Schema } = mongoose;

const schema = Schema(
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
			name: {
				type: String,
				maxlength: 128,
				required: true
			}
		},
		tags: [
			{
				name: {
					type: String,
					maxlength: 128,
					required: true
				}
			}
		],
		image: {
			type: String,
			required: true
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
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

const PUBLIC_FIELDS = ['_id', 'title', 'description', 'category', 'tags', 'image', 'owner'];

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

module.exports = mongoose.models.Auction || mongoose.model('Auction', schema);
