const Tag = require('../models/tag');
const Nft = require('../models/nft');

const { ServerError, NotFound, SendData, NotAcceptable } = require('../helpers/response');

/* Get all tags */
exports.get = (req, res, next) => {
	Tag.find({}, (err, tags) => {
		if (err) return next(ServerError());

		return next(SendData(tags));
	});
};

/* Get tag by id */
exports.getById = (req, res, next) => {
	Tag.findById(req.params.id, (err, tag) => {
		if (!tag) return next(NotFound());
		if (err) return next(ServerError());

		return next(SendData(tag.response()));
	});
};

/* Add new tag */
exports.add = (req, res, next) => {
	const tag = new Tag(req.body);

	tag.save((err, tags) => {
		if (err) return next(ServerError());

		return next(SendData(tag.response(), 201));
	});
};

/* Update tag by id */
exports.update = (req, res, next) => {
	Tag.findById(req.params.id, async (err, tag) => {
		if (!tag) return next(NotFound());
		if (err) return next(ServerError());

		const originalName = tag.name;
		const newName = req.body.name;

		if (originalName !== newName) {
			await Nft.updateMany({ tags: originalName }, { $set: { 'tags.$': newName } }, e => e && next(ServerError()));

			tag.name = newName;
			return tag.save((err2, doc) => {
				if (err2) return next(err2);
				return next(SendData(tag, 200));
			});
		}
		return next(NotAcceptable());
	});
};

/* Remove tag by id */
exports.delete = (req, res, next) => {
	Tag.findById(req.params.id, (err, tag) => {
		if (!tag) return next(NotFound());
		if (err) return next(ServerError());

		return Nft.find({ tags: tag.name }, (_err, nfts) => {
			if (nfts.length === 0) {
				return Tag.findByIdAndDelete(req.params.id, (e, _tag) => {
					if (!_tag) return next(NotFound());
					if (e) return next(ServerError());

					return next(SendData({ message: 'Tag deleted sucessfully!' }));
				});
			}
			return next(NotAcceptable());
		});
	});
};
