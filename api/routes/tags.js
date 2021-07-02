const express = require('express');
const controller = require('../controllers/tags');
const { validator } = require('../middlewares/validator');

const router = express.Router();

router
	.route('/')
	// get all tags
	.get(controller.get)
	// add new tag
	.post(validator('tag'), controller.add);

router
	.route('/:id')
	// get tag by id
	.get(controller.getById)
	// update tag by id
	.put(validator('tag'), controller.update)
	// remove tag by id
	.delete(controller.delete);

module.exports = router;
