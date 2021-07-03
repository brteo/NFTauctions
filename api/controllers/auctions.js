const Auction = require('../models/auction');

const { ServerError, NotFound, SendData } = require('../helpers/response');

/* Get all auctions */
exports.get = (req, res, next) => {
	Auction.find({}, (err, auctions) => {
		if (err) next(ServerError());
		else next(SendData(auctions));
	});
};

/* Get auction by id */
exports.getById = (req, res, next) => {
	Auction.findById(req.params.id, (err, auction) => {
		if (err || !auction) next(NotFound());
		else next(SendData(auction.getPublicFields()));
	});
};

/* Add new auction */
exports.add = (req, res, next) => {
	const auction = new Auction(req.body);
	auction.save((err, doc) => {
		if (err) next(ServerError());
		else next(SendData(auction.getPublicFields(), 201));
	});
};

/* Update an auction by id */
exports.update = (req, res, next) => {
	Auction.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, auction) => {
		if (err || !auction) next(NotFound());
		else next(SendData(auction.getPublicFields()));
	});
};

/* Remove auction by id */
exports.delete = (req, res, next) => {
	Auction.findById(req.params.id, async (err, auction) => {
		if (err || !auction) next(NotFound());
		await auction.softdelete();
		return next(SendData({ message: 'Auction deleted sucessfully!' }));
	});
};

/* Get auction by title */
exports.getByTitle = (req, res, next) => {
	Auction.findByTitle(req.params.title, (err, auction) => {
		if (err) next(NotFound());
		else next(SendData(auction.getPublicFields()));
	});
};
