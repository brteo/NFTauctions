module.exports = (schema, fields) => {
	schema.methods.getPublicFields = function () {
		return fields.reduce((acc, item) => {
			acc[item] = this[item];
			return acc;
		}, {});
	};

	schema.methods.getFields = function (f) {
		return f.reduce((acc, item) => {
			acc[item] = this[item];
			return acc;
		}, {});
	};

	schema.pre(['find'], function (next) {
		if (!this.selected()) this.select(fields);
		return next();
	});
};
