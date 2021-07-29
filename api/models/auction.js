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
		price: {
			type: Number,
			required: true
		},
		deadline: {
			type: Date,
			required: true
		},
		nft: {
			type: Number,
			ref: 'Nft',
			required: true
		},
		lastBets: [
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
				time: {
					type: Date,
					required: true
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
schema.index({ deadline: 1 }, { name: 'auctions list', partialFilterExpression: { active: true, deleted: false } });
schema.index(
	{ nft: 1 },
	{ name: 'active nft auction', partialFilterExpression: { active: true, deleted: false }, unique: true }
);

schema.plugin(softDelete);
schema.plugin(dbFields, { public: ['_id', 'description', 'basePrice', 'deadline', 'nft'] });

module.exports = mongoose.models.Auction || mongoose.model('Auction', schema);
