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

		return next(SendData(tag.getPublicFields()));
	});
};

/* Add new tag */
exports.add = (req, res, next) => {
	const tag = new Tag(req.body);

	tag.save((err, tags) => {
		if (err) return next(ServerError());

		return next(SendData(tag.getPublicFields(), 201));
	});
};

/* Update tag by id */
exports.update = (req, res, next) => {
	Tag.findById(req.params.id, (err, tag) => {
		if (!tag) return next(NotFound());
		if (err) return next(ServerError());

		const originalName = tag.name;
		const newName = req.body.name;

		if (originalName !== newName) {
			return Nft.find({ 'tags.name': originalName }, (_err, nfts) => {
				if (nfts.length !== 0) {
					nfts.forEach(a => {
						Nft.updateOne({ 'tags.name': originalName }, { $set: { 'tags.$.name': newName } }, (e, _nft) => {
							if (e) return next(ServerError());
						});
					});
				}

				return Tag.findByIdAndUpdate(req.params.id, req.body, { new: true }, (e, _tag) => {
					if (!_tag) return next(NotFound());
					if (e) return next(ServerError());

					return next(SendData(_tag.getPublicFields()));
				});
			});
		}
		return next(NotAcceptable());
	});

	Tag.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, tag) => {
		if (!tag) return next(NotFound());
		if (err) return next(ServerError());

		return next(SendData(tag.getPublicFields()));
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
