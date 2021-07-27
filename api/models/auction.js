const mongoose = require('mongoose');
const softDelete = require('../helpers/softDelete');
const dbFields = require('../helpers/dbFields');

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
		currentPrice: {
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
		lastBet: [
			{
				id: {
					type: mongoose.Schema.Types.ObjectId,
					required: true
				},
				user: {
					id: {
						type: mongoose.Schema.Types.ObjectId,
						required: true
					},
					nickname: String
				},
				price: {
					type: Number,
					maxlength: 128,
					required: true
				}
			}
		],
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
schema.plugin(dbFields, { public: ['_id', 'description', 'basePrice', 'deadlineTimestamp', 'nft'] });

module.exports = mongoose.models.Auction || mongoose.model('Auction', schema);
