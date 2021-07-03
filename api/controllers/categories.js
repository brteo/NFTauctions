const Category = require('../models/category');

const { ServerError, NotFound, SendData } = require('../helpers/response');

/* Get all categories */
exports.get = (req, res, next) => {
	Category.find({}, (err, categories) => {
		if (err) next(ServerError());
		else next(SendData(categories));
	});
};

/* Get category by id */
exports.getById = (req, res, next) => {
	Category.findById(req.params.id, (err, category) => {
		if (err || !category) next(NotFound());
		else next(SendData(category.getPublicFields()));
	});
};

/* Add new category */
exports.add = (req, res, next) => {
	const _category = new Category(req.body);
	_category.save((err, category) => {
		if (err) next(ServerError());
		else next(SendData(category.getPublicFields(), 201));
	});
};

/* Update category by id */
exports.update = (req, res, next) => {
	Category.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, category) => {
		if (err || !category) next(NotFound());
		else next(SendData(category.getPublicFields()));
	});
};

/* Remove category by id */
exports.delete = (req, res, next) => {
	Category.findByIdAndUpdate(req.params.id, { new: true }, (err, category) => {
		if (err || !category) next(NotFound());
		else next(SendData({ message: 'Category deleted sucessfully!' }));
	});
};
