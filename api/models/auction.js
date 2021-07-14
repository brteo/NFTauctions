const mongoose = require('mongoose');
const softDelete = require('../helpers/softDelete');
const publicFields = require('../helpers/publicFields');

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
schema.plugin(publicFields, ['_id', 'title', 'description', 'category', 'tags', 'image', 'owner']);

module.exports = mongoose.models.Auction || mongoose.model('Auction', schema);
