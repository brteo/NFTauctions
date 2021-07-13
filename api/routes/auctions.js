const express = require('express');
const controller = require('../controllers/auctions');
const { validator } = require('../middlewares/validator');
const rbac = require('../middlewares/rbac');
const { isAuth } = require('../middlewares/isAuth');

const router = express.Router();

router
	.route('/')
	// get all auctions
	.get(isAuth, rbac('auctions', 'read:any'), controller.get)
	// add new auction
	.post(isAuth, rbac('auctions', 'create:any'), validator('addAuction'), controller.add);

router
	.route('/:id')
	// get auction by id
	.get(isAuth, rbac('auctions', 'read'), controller.getById)
	// update auction by id
	.patch(isAuth, rbac('auctions', 'update'), validator('auction'), controller.update)
	// remove auction by id
	.delete(isAuth, rbac('auctions', 'delete'), controller.delete);

router
	.route('/:title')
	// get auction by title
	.get(isAuth, rbac('auctions', 'read:any'), controller.getByTitle);

module.exports = router;
