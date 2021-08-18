const mongoose = require('mongoose');
const softDelete = require('../helpers/softDelete');
const dbFields = require('../helpers/dbFields');

const { Schema } = mongoose;

const schema = Schema(
	{
		_id: Number,
		title: {
			type: String,
			index: true,
			maxlength: 128,
			required: true
		},
		description: {
			type: String,
			maxlength: 256,
			required: true
		},
		category: {
			id: {
				type: mongoose.Schema.Types.ObjectId,
				required: true
			},
			name: {
				type: Map,
				of: String
			}
		},
		tags: [
			{
				type: String,
				maxlength: 30,
				required: true
			}
		],
		url: {
			type: String,
			required: true
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			index: true,
			required: true
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			index: true,
			required: true
		}
	},
	{
		timestamps: true,
		toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
		toObject: { virtuals: true } // So `toObject()` output includes virtuals
	}
);
schema.plugin(softDelete);
schema.plugin(dbFields, {
	public: ['_id', 'title', 'description', 'category', 'url', 'author', 'owner'],
	detail: ['_id', 'title', 'description', 'category', 'tags', 'url', 'author', 'owner']
});

schema.virtual('auction', {
	ref: 'Auction',
	localField: '_id',
	foreignField: 'nft',
	justOne: true,
	match: { active: true }
});

schema.index(
	{ title: 'text', description: 'text', tags: 'text' },
	{
		weights: {
			title: 10,
			description: 1,
			keywords: 5
		},
		name: 'text'
	}
);

schema.statics.search = function (q) {
	return this.model('Nft')
		.find({ $text: { $search: q } }, { ...this.model('Nft').getProjectFields(), ...{ score: { $meta: 'textScore' } } })
		.populate({ path: 'auction', select: 'price deadline' })
		.populate('author')
		.populate('owner')
		.sort({ score: { $meta: 'textScore' } })
		.exec();
};

module.exports = mongoose.models.Nft || mongoose.model('Nft', schema);
