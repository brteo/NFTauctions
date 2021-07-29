const mongoose = require('mongoose');
const dbFields = require('../helpers/dbFields');

const schema = new mongoose.Schema(
	{
		auction: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Auction',
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
	},
	{
		timestamps: true
	}
);
schema.index({ auction: -1, time: -1 }, { name: 'bet list' });

schema.plugin(dbFields, { public: ['_id', 'auction', 'user', 'time', 'price'] });

module.exports = mongoose.model('Bet', schema);
