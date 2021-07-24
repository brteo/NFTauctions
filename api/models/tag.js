const mongoose = require('mongoose');
const toJson = require('../helpers/toJson');

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

schema.plugin(toJson, { publicFields: ['_id', 'name'] });

module.exports = mongoose.model('Tag', schema);
