const Nft = require('../models/nft');
const Auction = require('../models/auction');
const User = require('../models/user');
const Category = require('../models/category');

const { ServerError, NotFound, SendData, Forbidden, CustomError } = require('../helpers/response');
const { eos, addKey } = require('../helpers/eosjs');

/* Get all nfts */
exports.get = (req, res, next) => {
	Nft.find({})
		.populate({ path: 'auction', select: 'price deadline' })
		.populate('author')
		.populate('owner')
		.exec((err, nfts) => {
			if (err) return next(ServerError());
			return next(SendData(nfts));
		});
};

/* Get all nfts with auctions */
exports.getAuctions = (req, res, next) => {
	Auction.aggregate([
		{ $match: { active: true } },
		{
			$lookup: {
				from: Nft.collection.name,
				localField: 'nft',
				foreignField: '_id',
				as: 'nfts',
				pipeline: [{ $project: Nft.getProjectFields() }]
			}
		},
		{
			$replaceRoot: {
				newRoot: {
					$mergeObjects: [{ $arrayElemAt: ['$nfts', 0] }, { auction: { price: '$price', deadline: '$deadline' } }]
				}
			}
		},
		{
			$lookup: {
				from: User.collection.name,
				localField: 'author',
				foreignField: '_id',
				as: 'author',
				pipeline: [{ $project: User.getProjectFields() }]
			}
		},
		{ $unwind: '$author' },
		{
			$lookup: {
				from: User.collection.name,
				localField: 'owner',
				foreignField: '_id',
				as: 'owner',
				pipeline: [{ $project: User.getProjectFields() }]
			}
		},
		{ $unwind: '$owner' }
	]).exec((err, nfts) => {
		if (err) return next(ServerError(err));
		return next(SendData(nfts));
	});
};

/* Get nft by id */
exports.getById = (req, res, next) => {
	Nft.findById(req.params.id, (err, nft) => {
		if (err) return next(ServerError());
		if (!nft) return next(NotFound());

		return next(SendData(nft.response()));
	});
};

/* Add new nft */
exports.create = async (req, res, next) => {
	const nft = new Nft(req.body);
	const { account, id } = res.locals.user;
	nft.author = id;
	nft.owner = id;

	try {
		const category = await Category.findById(nft.category.id).exec();
		if (!category) return next(CustomError('Category not found', 404, {}, 404));

		nft.category.name = category.name;
	} catch (err) {
		return next(ServerError(err));
	}

	try {
		addKey(res.locals.user.getPrivateKey());
		const transactionResult = await eos.transact(
			{
				actions: [
					{
						account: 'mebtradingvg',
						name: 'create',
						authorization: [
							{
								actor: 'mebtradingvg',
								permission: 'active'
							},
							{
								actor: account,
								permission: 'active'
							}
						],
						data: {
							data: { title: nft.title, url: nft.url },
							author: account,
							owner: account
						}
					}
				]
			},
			{
				blocksBehind: 3,
				expireSeconds: 30
			}
		);
		nft._id = transactionResult.processed.action_traces[0].return_value_data;
	} catch (e) {
		if (e.json) {
			console.log(e.json);
		} else {
			console.log(e + '');
		}
		return next(ServerError());
	}

	return nft.save((err, doc) => {
		if (err) {
			console.log('ADDED ERROR 2 ' + err);
			return next(err);
		}
		/*
		// AGGIUNGERE I TAG SUL DB
		const tagNames = nft.tags; // .map(e => e.name);
		try {
			const tags = await Tag.find().where('name').in(tagNames).exec();
			if (tags.length === 0) return next(CustomError('Tag not found', 404, {}, 404));
		} catch (err) {
			return next(ServerError(err));
		}
		*/

		return next(SendData(nft.response(), 201));
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

			return next(SendData(_nft.response()));
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
