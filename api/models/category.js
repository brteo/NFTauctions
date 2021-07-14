const mongoose = require('mongoose');
const publicFields = require('../helpers/publicFields');

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

schema.plugin(publicFields, ['_id', 'name']);

module.exports = mongoose.model('Category', schema);
