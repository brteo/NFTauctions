const express = require('express');
const controller = require('../controllers/auctions');

const router = express.Router();

router
	.route('/')
	// get all auctions
	.get(controller.get)
	// add new auction
	.post(controller.add);

router
	.route('/:id')
	// get auction by id
	.get(controller.getById)
	// update auction by id
	.patch(controller.update)
	// remove auction by id
	.delete(controller.delete);

module.exports = router;
