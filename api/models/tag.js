const mongoose = require('mongoose');
const dbFields = require('../helpers/dbFields');

const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			index: true,
			maxlength: 128,
			required: true
		}
	},
	{
		timestamps: true
	}
);

schema.plugin(dbFields, { public: ['_id', 'name'] });

module.exports = mongoose.model('Tag', schema);
