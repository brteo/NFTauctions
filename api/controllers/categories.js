const Category = require('../models/category');

const { ServerError } = require('../helpers/response');

/* Get all categories */
exports.get = (req, res, next) => {
	Category.find({}, (err, doc) => {
		if (err) next(ServerError);
		else res.json(doc);
	});
};

/* Add new category */
exports.add = (req, res, next) => {
	const category = new Category(req.body);
	category.save((err, doc) => {
		if (err) next(ServerError);
		else res.json(doc);
	});
};

/* Get category by id */
exports.getById = (req, res, next) => {
	Category.findById(req.params.id, (err, doc) => {
		if (err) next(ServerError);
		else res.json(doc);
	});
};

/* Update category by id */
exports.update = (req, res, next) => {
	Category.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, doc) => {
		if (err) next(ServerError);
		else res.json(doc);
	});
};

/* Remove category by id */
exports.delete = (req, res, next) => {
	Category.findByIdAndUpdate(req.params.id, { deleted: true, active: false }, { new: true }, (err, doc) => {
		if (err) next(ServerError);
		else res.json(doc);
	});
};
