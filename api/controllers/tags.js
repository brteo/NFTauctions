const Tag = require('../models/tag');

/* Get all tags */
exports.get = (req, res) => {
	Tag.find({}, (err, doc) => {
		if (err) res.status(500).json(err);
		else res.json(doc);
	});
};

/* Add new category */
exports.add = (req, res) => {
	const tag = new Tag(req.body);
	tag.save((err, doc) => {
		if (err) res.status(500).json(err);
		else res.json(doc);
	});
};

/* Get category by id */
exports.getById = (req, res) => {
	Tag.findById(req.params.id, (err, doc) => {
		if (err) res.status(500).json(err);
		else res.json(doc);
	});
};

/* Update category by id */
exports.update = (req, res) => {
	Tag.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, doc) => {
		if (err) res.status(500).json(err);
		else res.json(doc);
	});
};

/* Remove category by id */
exports.delete = (req, res) => {
	Tag.findByIdAndUpdate(req.params.id, { deleted: true, active: false }, { new: true }, (err, doc) => {
		if (err) res.status(500).json(err);
		else res.json(doc);
	});
};
