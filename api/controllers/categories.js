const Category = require('../models/category');
const Nft = require('../models/nft');

const { ServerError, NotFound, SendData, NotAcceptable } = require('../helpers/response');

/* Get all categories */
exports.get = (req, res, next) => {
	Category.find({}, (err, categories) => {
		if (err) return next(ServerError());

		return next(SendData(categories));
	});
};

/* Get category by id */
exports.getById = (req, res, next) => {
	Category.findById(req.params.id, (err, category) => {
		if (!category) return next(NotFound());
		if (err) return next(ServerError());

		return next(SendData(category.response()));
	});
};

/* Add new category */
exports.add = (req, res, next) => {
	const _category = new Category(req.body);

	_category.save((err, category) => {
		if (err) return next(err);

		return next(SendData(category.response(), 201));
	});
};

/* Update category by id */
exports.update = (req, res, next) => {
	Category.findById(req.params.id, (err, category) => {
		if (!category) return next(NotFound());
		if (err) return next(ServerError());

		return Nft.find({ 'category.id': req.params.id }, (_err, nfts) => {
			if (_err) return next(ServerError());

			if (nfts.length !== 0) {
				nfts.forEach(nft => {
					Nft.findByIdAndUpdate(nft.id, { 'category.name': req.body.name }, (e, _nft) => e && next(ServerError()));
				});
			}

			return Category.findByIdAndUpdate(req.params.id, req.body, { new: true }, (e, _category) => {
				if (!_category) return next(NotFound());
				if (e) return next(ServerError());

				return next(SendData(_category.response()));
			});
		});
	});
};

/* Remove category by id */
exports.delete = (req, res, next) => {
	Category.findById(req.params.id, (err, category) => {
		if (!category) return next(NotFound());
		if (err) return next(ServerError());

		return Nft.find({ 'category.id': req.params.id }, (_err, nfts) => {
			if (nfts.length === 0) {
				return Category.findByIdAndDelete(req.params.id, (e, _category) => {
					if (!_category) return next(NotFound());
					if (e) return next(ServerError());

					return next(SendData({ message: 'Category deleted sucessfully!' }));
				});
			}
			return next(NotAcceptable());
		});
	});
};
