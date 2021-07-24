const { AWS_S3_ENDPOINT, AWS_S3_BUCKET_NAME } = process.env;

module.exports = (schema, options) => {
	const { publicFields, dataFields } = options;

	const getFields = function (fields) {
		if (!fields) {
			return publicFields;
		}
		if (typeof fields === 'string') {
			return options[fields];
		}
		return fields;
	};

	schema.statics.getFields = getFields;
	schema.methods.getFields = getFields;

	schema.methods.parseField = function (field) {
		if (dataFields && dataFields.includes(field)) {
			return AWS_S3_ENDPOINT + '/' + AWS_S3_BUCKET_NAME + '/' + this[field];
		}
		return this[field];
	};

	schema.methods.toJson = function (fields) {
		return this.getFields(fields).reduce((acc, item) => {
			acc[item] = this.parseField(item);
			return acc;
		}, {});
	};

	schema.pre(['find'], function (next) {
		if (!this.selected()) this.select(publicFields);
		return next();
	});
};
