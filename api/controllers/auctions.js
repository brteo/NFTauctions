const Auction = require('../models/auction');

const { ServerError, SendData } = require('../helpers/response');

/* Get all auctions */
exports.get = (req, res, next) => {
	Auction.find({}, (err, doc) => {
		if (err) next(ServerError());
		else next(SendData(doc));
	});
};

/* Add new auction */
exports.add = (req, res, next) => {
	const auction = new Auction(req.body);
	auction.save((err, doc) => {
		if (err) next(ServerError());
		else next(SendData(doc));
	});
};

/* Get auction by id */
exports.getById = (req, res, next) => {
	Auction.findById(req.params.id, (err, doc) => {
		if (err) next(ServerError());
		else next(SendData(doc));
	});
};

/* Update an auction by id */
exports.update = (req, res, next) => {
	Auction.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, doc) => {
		if (err) next(ServerError());
		else next(SendData(doc));
	});
};

/* Remove auction by id */
exports.delete = (req, res, next) => {
	Auction.findByIdAndUpdate(req.params.id, { deleted: true, active: false }, { new: true }, (err, doc) => {
		if (err) next(ServerError());
		else next(SendData(doc));
	});
};

/* Get auction by title */
exports.getByTitle = (req, res, next) => {
	Auction.findByTitle(req.params.title, (err, doc) => {
		if (err) next(ServerError());
		else next(SendData(doc));
	});
};
