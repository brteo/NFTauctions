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
			maxlength: 128,
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
			required: true
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		}
	},
	{
		timestamps: true
	}
);
schema.plugin(softDelete);
schema.plugin(dbFields, { public: ['_id', 'title', 'description', 'category', 'tags', 'url', 'author', 'owner'] });

module.exports = mongoose.models.Nft || mongoose.model('Nft', schema);
