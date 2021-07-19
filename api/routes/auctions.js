const express = require('express');
const controller = require('../controllers/auctions');
const { validator } = require('../middlewares/validator');
const rbac = require('../middlewares/rbac');
const { isAuth } = require('../middlewares/isAuth');

const router = express.Router();

router
	.route('/')
	// get all auctions
	.get(controller.get)
	// add new auction
	.post(isAuth, rbac('auctions', 'create'), validator('addAuction'), controller.add);

router
	.route('/:id')
	// get auction by id
	.get(validator({ params: 'objectId' }), controller.getById)
	// update auction by id
	.patch(isAuth, rbac('auctions', 'update'), validator({ body: 'auction', params: 'objectId' }), controller.update)
	// remove auction by id
	.delete(isAuth, rbac('auctions', 'delete'), validator({ params: 'objectId' }), controller.delete);

router
	.route('/:title')
	// get auction by title
	.get(controller.getByTitle);

module.exports = router;
