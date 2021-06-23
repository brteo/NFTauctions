const express = require('express');
const controller = require('../controllers/users');

const router = express.Router();

router
	.route('/')
	// get
	.get(controller.get)
	// add
	.post(controller.add);

router
	.route('/:id')
	// get by id
	.get(controller.getById)
	// put
	.put(controller.update)
	// delete
	.delete(controller.delete);

module.exports = router;
