const Tag = require('../models/tag');

const { ServerError, NotFound, SendData } = require('../helpers/response');

/* Get all tags */
exports.get = (req, res, next) => {
	Tag.find({}, (err, tags) => {
		if (err) next(ServerError());
		else next(SendData(tags));
	});
};

/* Get tag by id */
exports.getById = (req, res, next) => {
	Tag.findById(req.params.id, (err, tag) => {
		if (err || !tag) next(NotFound());
		else next(SendData(tag.getPublicFields()));
	});
};

/* Add new tag */
exports.add = (req, res, next) => {
	const tag = new Tag(req.body);
	tag.save((err, tags) => {
		if (err) next(ServerError());
		else next(SendData(tag.getPublicFields(), 201));
	});
};

/* Update tag by id */
exports.update = (req, res, next) => {
	Tag.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, tag) => {
		if (err || !tag) next(NotFound());
		else next(SendData(tag.getPublicFields()));
	});
};

/* Remove tag by id */
exports.delete = (req, res, next) => {
	Tag.findByIdAndUpdate(req.params.id, { new: true }, (err, tag) => {
		if (err || !tag) next(NotFound());
		else next(SendData({ message: 'Tag deleted sucessfully!' }));
	});
};
