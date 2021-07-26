const mongoose = require('mongoose');
const dbFields = require('../helpers/dbFields');

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

schema.plugin(dbFields, { public: ['_id', 'name'] });

module.exports = mongoose.model('Category', schema);
