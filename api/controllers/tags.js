const Tag = require('../models/tag');
const Auction = require('../models/auction');

const { ServerError, NotFound, SendData, NotAcceptable } = require('../helpers/response');

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
	Tag.findById(req.params.id, (err, tag) => {
		if (err || !tag) next(NotFound());
		else {
			const originalName = tag.name;
			const newName = req.body.name;

			if (originalName !== newName) {
				Auction.find({ 'tags.name': originalName }, (_err, auctions) => {
					if (auctions.length !== 0) {
						auctions.forEach(a => {
							Auction.updateOne(
								{ 'tags.name': originalName },
								{ $set: { 'tags.$.name': newName } },
								(e, _auction) => {}
							);
						});
					}
					Tag.findByIdAndUpdate(req.params.id, req.body, { new: true }, (e, _tag) => {
						if (e || !_tag) next(NotFound());
						else next(SendData(_tag.getPublicFields()));
					});
				});
			} else {
				next(NotAcceptable());
			}
		}
	});

	Tag.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, tag) => {
		if (err || !tag) next(NotFound());
		else next(SendData(tag.getPublicFields()));
	});
};

/* Remove tag by id */
exports.delete = (req, res, next) => {
	Tag.findById(req.params.id, (err, tag) => {
		if (err || !tag) next(NotFound());
		else {
			Auction.find({ 'tags.name': tag.name }, (_err, auctions) => {
				if (auctions.length === 0) {
					Tag.findByIdAndDelete(req.params.id, (e, _tag) => {
						if (err || !_tag) next(NotFound());
						else next(SendData({ message: 'Tag deleted sucessfully!' }));
					});
				} else {
					next(NotAcceptable());
				}
			});
		}
	});
};
