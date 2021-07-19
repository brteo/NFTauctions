const mongoose = require('mongoose');
const publicFields = require('../helpers/publicFields');

const schema = new mongoose.Schema(
	{
		name: {
			type: Map,
			of: String
		}
	},
	{
		timestamps: true
	}
);

schema.plugin(publicFields, ['_id', 'name']);

module.exports = mongoose.model('Category', schema);
