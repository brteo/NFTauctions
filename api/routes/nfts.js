const express = require('express');
const controller = require('../controllers/nfts');
const { validator } = require('../middlewares/validator');
const rbac = require('../middlewares/rbac');
const { isAuth } = require('../middlewares/isAuth');

const router = express.Router();

router.route('/').get(controller.get).post(isAuth, rbac('nfts', 'create'), validator('createNft'), controller.create);
router.route('/filter/:filter').get(controller.filter);
router.route('/auctions').get(controller.getAuctions);

router
	.route('/:id')
	.get(validator({ params: 'nftId' }), controller.getById)
	.patch(validator({ params: 'nftId', body: 'nft' }), isAuth, rbac('nfts', 'update'), controller.update)
	.delete(validator({ params: 'nftId' }), isAuth, rbac('nfts', 'delete'), controller.delete);

module.exports = router;
