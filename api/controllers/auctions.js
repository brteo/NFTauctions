const Auction = require('../models/auction');
const Nft = require('../models/nft');

const { ServerError, NotFound, SendData, Forbidden, CustomError } = require('../helpers/response');

/* Get all auctions */
exports.get = (req, res, next) => {
	Auction.find({}, (err, auctions) => {
		if (err) return next(ServerError());

		console.log(auctions);

		return next(SendData(auctions));
	});
};

/* Get auction by id */
exports.getById = (req, res, next) => {
	Auction.findById(req.params.id, (err, auction) => {
		if (!auction) return next(NotFound());
		if (err) return next(ServerError());

		return next(SendData(auction.getPublicFields()));
	});
};

/* Add new auction */
exports.add = async (req, res, next) => {
	const auction = new Auction(req.body);

	await Nft.findById(auction.nft, (err, nfts) => {
		if (err || !nfts || nfts.length === 0) {
			next(CustomError('Nft not found', 404, {}, 404));
		}
	});

	await auction.save((err, doc) => {
		if (err) next(err);

		return next(SendData(auction.getPublicFields(), 201));
	});
};

/* Get auction by title */
exports.getByTitle = (req, res, next) => {
	Auction.findByTitle(req.params.title, (err, auction) => {
		if (err) return next(ServerError());
		if (!auction) return next(NotFound());

		return next(SendData(auction.getPublicFields()));
	});
};

/* Update an auction by id */
exports.update = (req, res, next) => {
	const owner = res.locals.user.id;
	const _type = res.locals.grants.type;

	Auction.findById(req.params.id, (err, auction) => {
		if (!auction) return next(NotFound());
		if (err) return next(ServerError());

		return Nft.findById(auction.nft, (_err, nft) => {
			if (err) return next(ServerError());
			if (!nft) return next(NotFound());
			if (_type !== 'any' && String(nft.owner) !== String(owner)) return next(Forbidden());

			return Auction.findByIdAndUpdate(req.params.id, req.body, { new: true }, (e, _auction) => {
				if (e) return next(ServerError());
				return next(SendData(_auction.getPublicFields()));
			});
		});
	});
};

/* Remove auction by id */
exports.delete = (req, res, next) => {
	const owner = res.locals.user.id;
	const _type = res.locals.grants.type;

	Auction.findById(req.params.id, async (err, auction) => {
		if (err) return next(ServerError());
		if (!auction) return next(NotFound());

		return Nft.findById(auction.nft, async (_err, nft) => {
			if (_type !== 'any' && String(nft.owner) !== String(owner)) return next(Forbidden());

			await auction.softdelete();
			return next(SendData({ message: 'Auction deleted sucessfully!' }));
		});
	});
};
