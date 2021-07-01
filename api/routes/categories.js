const express = require('express');
const controller = require('../controllers/categories');
const { categoryValidator } = require('../middlewares/ajv');

const router = express.Router();

router
	.route('/')
	// get all categories
	.get(controller.get)
	// add new category
	.post(categoryValidator, controller.add);

router
	.route('/:id')
	// get category by id
	.get(controller.getById)
	// update category by id
	.put(controller.update)
	// remove category by id
	.delete(controller.delete);

module.exports = router;
