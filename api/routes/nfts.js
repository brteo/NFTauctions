const express = require('express');
const controller = require('../controllers/nfts');
const { validator } = require('../middlewares/validator');
const rbac = require('../middlewares/rbac');
const { isAuth } = require('../middlewares/isAuth');

const router = express.Router();

router.route('/').get(controller.get).post(isAuth, rbac('nfts', 'create'), validator('createNft'), controller.add);

router
	.route('/:id')
	.get(controller.getById)
	.patch(isAuth, rbac('nfts', 'update'), validator('nft'), controller.update)
	.delete(isAuth, rbac('nfts', 'delete'), controller.delete);

router.route('/:title').get(controller.getByTitle);

module.exports = router;
