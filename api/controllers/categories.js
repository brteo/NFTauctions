const Category = require('../models/category');

/* Get all categories */
exports.get = (req, res) => {
	Category.find({}, (err, doc) => {
		if (err) res.status(500).json(err);
		else res.json(doc);
	});
};

/* Add new category */
exports.add = (req, res) => {
	const auction = new Category(req.body);
	auction.save((err, doc) => {
		if (err) res.status(500).json(err);
		else res.json(doc);
	});
};

/* Get category by id */
exports.getById = (req, res) => {
	Category.findById(req.params.id, (err, doc) => {
		if (err) res.status(500).json(err);
		else res.json(doc);
	});
};

/* Update category by id */
exports.update = (req, res) => {
	Category.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, doc) => {
		if (err) res.status(500).json(err);
		else res.json(doc);
	});
};

/* Remove category by id */
exports.delete = (req, res) => {
	Category.findByIdAndUpdate(req.params.id, { deleted: true, active: false }, { new: true }, (err, doc) => {
		if (err) res.status(500).json(err);
		else res.json(doc);
	});
};
