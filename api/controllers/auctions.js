const Auction = require('../models/auction');

/* Get all auctions */
exports.get = (req, res) => {
	Auction.find({}, (err, doc) => {
		if (err) res.status(500).json(err);
		else res.json(doc);
	});
};

/* Add new auction */
exports.add = (req, res) => {
	const auction = new Auction(req.body);
	auction.save((err, doc) => {
		if (err) res.status(500).json(err);
		else res.json(doc);
	});
};

/* Get auction by id */
exports.getById = (req, res) => {
	Auction.findById(req.params.id, (err, doc) => {
		if (err) res.status(500).json(err);
		else res.json(doc);
	});
};

exports.update = (req, res) => {
	Auction.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, doc) => {
		if (err) res.status(500).json(err);
		else res.json(doc);
	});
};

/* Remove auction by id */
exports.delete = (req, res) => {
	Auction.findByIdAndUpdate(req.params.id, { deleted: true, active: false }, { new: true }, (err, doc) => {
		if (err) res.status(500).json(err);
		else res.json(doc);
	});
};
