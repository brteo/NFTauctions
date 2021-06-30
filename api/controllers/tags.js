const Tag = require('../models/tag');

const { ServerError } = require('../helpers/response');

/* Get all tags */
exports.get = (req, res, next) => {
	Tag.find({}, (err, doc) => {
		if (err) next(ServerError);
		else res.json(doc);
	});
};

/* Add new category */
exports.add = (req, res, next) => {
	const tag = new Tag(req.body);
	tag.save((err, doc) => {
		if (err) next(ServerError);
		else res.json(doc);
	});
};

/* Get category by id */
exports.getById = (req, res, next) => {
	Tag.findById(req.params.id, (err, doc) => {
		if (err) next(ServerError);
		else res.json(doc);
	});
};

/* Update category by id */
exports.update = (req, res, next) => {
	Tag.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, doc) => {
		if (err) next(ServerError);
		else res.json(doc);
	});
};

/* Remove category by id */
exports.delete = (req, res, next) => {
	Tag.findByIdAndUpdate(req.params.id, { deleted: true, active: false }, { new: true }, (err, doc) => {
		if (err) next(ServerError);
		else res.json(doc);
	});
};
