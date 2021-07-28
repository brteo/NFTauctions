module.exports = (schema, options) => {
	const getFields = function (fields) {
		if (!fields) {
			return options.public;
		}
		if (typeof fields === 'string') {
			return options[fields];
		}
		return fields;
	};

	schema.statics.getFields = getFields;

	schema.statics.getProjectFields = function (fields) {
		return schema.statics.getFields(fields).reduce((acc, item) => {
			acc[item] = 1;
			return acc;
		}, {});
	};

	schema.methods.response = function (fields) {
		return getFields(fields).reduce((acc, item) => {
			acc[item] = this[item];
			return acc;
		}, {});
	};

	schema.pre(['find'], function (next) {
		if (!this.selected()) this.select(options.public);
		return next();
	});
};
