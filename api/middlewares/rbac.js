const { check } = require('../helpers/rbac');

module.exports = (resource, action) => (req, res, next) => {
	check(res.locals.user.role, resource, action)
		.then(grants => {
			res.locals.grants = grants;
			next();
		})
		.catch(err => {
			next(err);
		});
};
