const mongoose = require('mongoose');
const toJson = require('../helpers/toJson');

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

schema.plugin(toJson, { publicFields: ['_id', 'name'] });

module.exports = mongoose.model('Category', schema);
