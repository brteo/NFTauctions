const mongoose = require('mongoose');
const softDelete = require('../helpers/softDelete');
const publicFields = require('../helpers/publicFields');

const { Schema } = mongoose;

const schema = Schema(
	{
		basePrice: {
			type: Number,
			required: true
		},
		deadlineTimestamp: {
			type: Date,
			required: true
		},
		nft: {
			type: mongoose.Schema.Types.ObjectId,
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
schema.plugin(publicFields, ['_id', 'basePrice', 'deadlineTimestamp', 'nft']);

module.exports = mongoose.models.Auction || mongoose.model('Auction', schema);
