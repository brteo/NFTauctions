const mongoose = require('mongoose');

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

const PUBLIC_FIELDS = ['_id', 'name'];

schema.methods.getPublicFields = function () {
	return PUBLIC_FIELDS.reduce((acc, item) => {
		acc[item] = this[item];
		return acc;
	}, {});
};

schema.pre(['find'], function (next) {
	if (!this.selected()) this.select(PUBLIC_FIELDS);
	return next();
});

module.exports = mongoose.model('Category', schema);
