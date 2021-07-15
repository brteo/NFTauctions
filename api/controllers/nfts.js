const Nft = require('../models/nft');
const Category = require('../models/category');
const Tag = require('../models/tag');

const { ServerError, NotFound, SendData, Forbidden, CustomError } = require('../helpers/response');

/* Get all nfts */
exports.get = (req, res, next) => {
	Nft.find({}, (err, nfts) => {
		if (err) return next(ServerError());

		return next(SendData(nfts));
	});
};

/* Get nft by id */
exports.getById = (req, res, next) => {
	Nft.findById(req.params.id, (err, nft) => {
		if (err) return next(ServerError());
		if (!nft) return next(NotFound());

		return next(SendData(nft.getPublicFields()));
	});
};

/* Add new nft */
exports.add = (req, res, next) => {
	const nft = new Nft(req.body);
	nft.author = res.locals.user.id;
	nft.owner = res.locals.user.id;

	Category.find({ name: nft.category.name }, (err, categories) => {
		if (err || !categories || categories.length === 0) {
			next(CustomError('Category not found', 404, {}, 404));
		}
	});

	const tagNames = nft.tags.map(e => e.name);

	Tag.find()
		.where('name')
		.in(tagNames)
		.exec((err, tags) => {
			if (err || !tags || tags.length === 0) {
				next(CustomError('Tag not found', 404, {}, 404));
			}
		});

	nft.save((err, doc) => {
		if (err) return next(err);

		return next(SendData(nft.getPublicFields(), 201));
	});
};

/* Get nft by title */
exports.getByTitle = (req, res, next) => {
	Nft.findByTitle(req.params.title, (err, nft) => {
		if (err) return next(NotFound());

		return next(SendData(nft.getPublicFields()));
	});
};

/* Update an nft by id */
exports.update = (req, res, next) => {
	const author = res.locals.user.id;
	const _type = res.locals.grants.type;

	Nft.findById(req.params.id, (err, nft) => {
		if (err) return next(ServerError());
		if (!nft) return next(NotFound());
		if (_type !== 'any' && String(nft.author) !== String(author)) return next(Forbidden());

		return Nft.findByIdAndUpdate(req.params.id, req.body, { new: true }, (_err, _nft) => {
			if (err) return next(ServerError());

			return next(SendData(_nft.getPublicFields()));
		});
	});
};

/* Remove nft by id */
exports.delete = (req, res, next) => {
	const owner = res.locals.user.id;
	const _type = res.locals.grants.type;

	Nft.findById(req.params.id, async (err, nft) => {
		if (err) return next(ServerError());
		if (!nft) return next(NotFound());
		if (String(nft.owner) !== String(nft.author)) return next(Forbidden());
		if (_type !== 'any' && String(nft.owner) !== String(owner)) return next(Forbidden());

		await nft.softdelete();
		return next(SendData({ message: 'Nft deleted sucessfully!' }));
	});
};
