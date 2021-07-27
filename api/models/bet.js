const mongoose = require('mongoose');
const dbFields = require('../helpers/dbFields');

const schema = new mongoose.Schema(
	{
		auction: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Auction',
			index: true,
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
	},
	{
		timestamps: true
	}
);

schema.plugin(dbFields, { public: ['_id', 'auction', 'user', 'price'] });

module.exports = mongoose.model('Bet', schema);
