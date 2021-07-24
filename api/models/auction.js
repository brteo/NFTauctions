const mongoose = require('mongoose');
const softDelete = require('../helpers/softDelete');
const toJson = require('../helpers/toJson');

const { Schema } = mongoose;

const schema = Schema(
	{
		description: {
			type: String,
			require: true
		},
		basePrice: {
			type: Number,
			required: true
		},
		deadlineTimestamp: {
			type: Date,
			required: true
		},
		nft: {
			type: Number,
			ref: 'Nft',
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
schema.plugin(toJson, { publicFields: ['_id', 'description', 'basePrice', 'deadlineTimestamp', 'nft'] });

module.exports = mongoose.models.Auction || mongoose.model('Auction', schema);
