const express = require('express');
const controller = require('../controllers/tags');
const { tagValidator } = require('../middlewares/ajv');

const router = express.Router();

router
	.route('/')
	// get all tags
	.get(controller.get)
	// add new tag
	.post(tagValidator, controller.add);

router
	.route('/:id')
	// get tag by id
	.get(controller.getById)
	// update tag by id
	.put(controller.update)
	// remove tag by id
	.delete(controller.delete);

module.exports = router;
