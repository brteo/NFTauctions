const Tag = require('../models/tag');

const { ServerError, SendData } = require('../helpers/response');

/* Get all tags */
exports.get = (req, res, next) => {
	Tag.find({}, (err, doc) => {
		if (err) next(ServerError());
		else next(SendData(doc));
	});
};

/* Add new category */
exports.add = (req, res, next) => {
	const tag = new Tag(req.body);
	tag.save((err, doc) => {
		if (err) next(ServerError());
		else next(SendData(doc, 201));
	});
};

/* Get category by id */
exports.getById = (req, res, next) => {
	Tag.findById(req.params.id, (err, doc) => {
		if (err) next(ServerError());
		else next(SendData(doc));
	});
};

/* Update category by id */
exports.update = (req, res, next) => {
	Tag.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, doc) => {
		if (err) next(ServerError());
		else next(SendData(doc));
	});
};

/* Remove category by id */
exports.delete = (req, res, next) => {
	Tag.findByIdAndUpdate(req.params.id, { new: true }, (err, doc) => {
		if (err) next(ServerError());
		else next(SendData(doc));
	});
};
