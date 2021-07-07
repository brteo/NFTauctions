const { validate } = require('../helpers/validator');

exports.validator = schemaName => (req, res, next) => {
	validate(schemaName, req)
		.then(() => next())
		.catch(err => next(err));
};
