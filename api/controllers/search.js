const Nft = require('../models/nft');
const User = require('../models/user');

const { ServerError, NotFound, SendData, Forbidden } = require('../helpers/response');

/* Search nfts */
exports.search = async (req, res, next) => {
	try {
		const values = await Promise.all([Nft.search(req.params.query), User.search(req.params.query)]);
		return next(SendData({ nfts: values[0], users: values[1] }));
	} catch (err) {
		return next(ServerError(err));
	}
};
