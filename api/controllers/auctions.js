const Auction = require('../models/auction');
const Nft = require('../models/nft');

const { ServerError, NotFound, SendData, Forbidden, CustomError } = require('../helpers/response');

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
	auction.owner = res.locals.user.id;

	Nft.find({ name: auction.nft }, (err, nfts) => {
		if (err || !nfts || nfts.length === 0) {
			next(CustomError('Nft not found', 404, {}, 404));
		}
	});

	auction.save((err, doc) => {
		if (err) next(err);
		else next(SendData(auction.getPublicFields(), 201));
	});
};

/* Get auction by title */
exports.getByTitle = (req, res, next) => {
	Auction.findByTitle(req.params.title, (err, auction) => {
		if (err) next(NotFound());
		else next(SendData(auction.getPublicFields()));
	});
};

/* Update an auction by id */
exports.update = (req, res, next) => {
	const owner = res.locals.user.id;
	const _type = res.locals.grants.type;

	Auction.findById(req.params.id, (err, auction) => {
		if (err || !auction) next(NotFound());
		else if (_type !== 'any' && String(auction.owner) !== String(owner)) next(Forbidden());
		else {
			Auction.findByIdAndUpdate(req.params.id, req.body, { new: true }, (_err, _auction) => {
				if (err) next(ServerError());
				else next(SendData(_auction.getPublicFields()));
			});
		}
	});
};

/* Remove auction by id */
exports.delete = (req, res, next) => {
	const owner = res.locals.user.id;
	const _type = res.locals.grants.type;

	Auction.findById(req.params.id, async (err, auction) => {
		if (err || !auction) return next(NotFound());
		if (_type !== 'any' && String(auction.owner) !== String(owner)) return next(Forbidden());
		await auction.softdelete();
		return next(SendData({ message: 'Auction deleted sucessfully!' }));
	});
};
