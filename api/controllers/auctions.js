const Auction = require('../models/auction');
const Nft = require('../models/nft');
const Bet = require('../models/bet');

const { ServerError, NotFound, SendData, Forbidden, CustomError } = require('../helpers/response');

/* Get all auctions */
exports.get = (req, res, next) => {
	Auction.find()
		.populate({
			path: 'nft',
			populate: [
				{
					path: 'owner',
					model: 'User'
				},
				{
					path: 'author',
					model: 'User'
				}
			]
		})
		.exec((_err, auctions) => {
			if (_err) return next(ServerError());
			return next(SendData(auctions));
		});
};

/* Get auction by id */
exports.getById = (req, res, next) => {
	Auction.findOne({ _id: req.params.id })
		.populate({
			path: 'nft',
			populate: [
				{
					path: 'owner',
					model: 'User'
				},
				{
					path: 'author',
					model: 'User'
				}
			]
		})
		.exec((_err, auction) => {
			if (!auction) return next(NotFound());
			if (_err) return next(ServerError());
			return next(SendData(auction.response()));
		});
};

/* Add new auction */
exports.add = async (req, res, next) => {
	const auction = new Auction(req.body);
	auction.currentPrice = req.body.basePrice;

	await Nft.findById(auction.nft, (err, nfts) => {
		if (err || !nfts || nfts.length === 0) {
			next(CustomError('Nft not found', 404, {}, 404));
		}
	});

	await auction.save((err, doc) => {
		if (err) next(err);

		return next(SendData(auction.response(), 201));
	});
};

/* Get auction by title */
exports.getByBasePrice = (req, res, next) => {
	Auction.find({ basePrice: req.params.basePrice }, (err, auctions) => {
		if (err) return next(ServerError());

		return next(SendData(auctions));
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
				return next(SendData(_auction.response()));
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

exports.getBets = (req, res, next) => {
	Bet.find({ auction: req.params.id }, (err, bets) => {
		if (err) next(ServerError());
		else next(SendData(bets));
	});
};

exports.addBet = (req, res, next) => {
	const { user: logged } = res.locals;
	const auctionId = req.params.id;
	const betPrice = req.body.price;

	// Auction.findByIdAndUpdate().then(
	// add bet with auction updatedAt
	// mongo add element array embedded + shift
	// )

	const bet = new Bet({
		auction: auctionId,
		user: {
			id: logged.id,
			nickname: logged.nickname,
			pic: logged.pic
		},
		price: betPrice
	});

	return bet.save((err, doc) => {
		if (err) next(err);

		return Bet.find({ auction: auctionId })
			.sort('-createdAt')
			.limit(10)
			.exec((errBets, bets) => {
				if (errBets) next(ServerError());

				const newBets = bets.map(({ id, user, price }) => ({ id, user, price }));

				return Auction.findByIdAndUpdate(
					auctionId,
					{ currentPrice: betPrice, bets: newBets },
					(errAcution, acution) => {
						if (errAcution) return next(ServerError());
						return next(SendData(doc.getPublicFields(), 201));
					}
				);
			});
	});
};
