const express = require('express');
const controller = require('../controllers/categories');
const { validator } = require('../middlewares/validator');

const router = express.Router();

router
	.route('/')
	// get all categories
	.get(controller.get)
	// add new category
	.post(validator('category'), controller.add);

router
	.route('/:id')
	// get category by id
	.get(controller.getById)
	// update category by id
	.put(validator('category'), controller.update)
	// remove category by id
	.delete(controller.delete);

module.exports = router;
