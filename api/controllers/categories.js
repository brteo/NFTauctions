const Category = require('../models/category');
const Auction = require('../models/auction');

const { ServerError, NotFound, SendData, IncorrectParameter } = require('../helpers/response');

/* Get all categories */
exports.get = (req, res, next) => {
	Category.find({}, (err, categories) => {
		if (err) next(ServerError());
		else next(SendData(categories));
	});
};

/* Get category by id */
exports.getById = (req, res, next) => {
	Category.findById(req.params.id, (err, category) => {
		if (err || !category) next(NotFound());
		else next(SendData(category.getPublicFields()));
	});
};

/* Add new category */
exports.add = (req, res, next) => {
	const _category = new Category(req.body);
	_category.save((err, category) => {
		if (err) next(ServerError());
		else next(SendData(category.getPublicFields(), 201));
	});
};

/* Update category by id */
exports.update = (req, res, next) => {
	Category.findById(req.params.id, (err, category) => {
		if (err || !category) next(NotFound());
		else {
			const originalName = category.name;
			const newName = req.body.name;

			if (originalName !== newName) {
				Auction.find({ 'category.name': originalName }, (_err, auctions) => {
					if (auctions.length !== 0) {
						auctions.forEach(a => {
							Auction.findByIdAndUpdate(a.id, { 'category.name': newName }, (e, _auction) => {});
						});
					}
					Category.findByIdAndUpdate(req.params.id, req.body, { new: true }, (e, _category) => {
						if (e || !_category) next(NotFound());
						else next(SendData(_category.getPublicFields()));
					});
				});
			} else {
				next(IncorrectParameter());
			}
		}
	});
};

/* Remove category by id */
exports.delete = (req, res, next) => {
	Category.findById(req.params.id, (err, category) => {
		if (err || !category) next(NotFound());
		else {
			Auction.find({ 'category.name': category.name }, (_err, auctions) => {
				if (auctions.length === 0) {
					Category.findByIdAndDelete(req.params.id, (e, _category) => {
						if (e || !_category) next(NotFound());
						else next(SendData({ message: 'Category deleted sucessfully!' }));
					});
				} else {
					next(IncorrectParameter());
				}
			});
		}
	});
};
