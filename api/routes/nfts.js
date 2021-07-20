const express = require('express');
const controller = require('../controllers/nfts');
const { validator } = require('../middlewares/validator');
const rbac = require('../middlewares/rbac');
const { isAuth } = require('../middlewares/isAuth');

const router = express.Router();

router.route('/').get(controller.get).post(isAuth, rbac('nfts', 'create'), validator('createNft'), controller.create);

router
	.route('/:id')
	.get(validator({ params: 'nftId' }), controller.getById)
	.patch(validator({ params: 'nftId', body: 'nft' }), isAuth, rbac('nfts', 'update'), controller.update)
	.delete(validator({ params: 'nftId' }), isAuth, rbac('nfts', 'delete'), controller.delete);

router.route('/:title').get(controller.getByTitle);

module.exports = router;
