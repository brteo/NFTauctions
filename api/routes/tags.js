const express = require('express');
const controller = require('../controllers/tags');
const { isAuth } = require('../middlewares/isAuth');
const rbac = require('../middlewares/rbac');
const { validator } = require('../middlewares/validator');

const router = express.Router();

router
	.route('/')
	// get all tags
	.get(isAuth, rbac('tags', 'read:any'), controller.get)
	// add new tag
	.post(isAuth, rbac('tags', 'create:any'), validator('tag'), controller.add);

router
	.route('/:id')
	// get tag by id
	.get(isAuth, rbac('tags', 'read'), controller.getById)
	// update tag by id
	.put(isAuth, rbac('tags', 'update'), validator('tag'), controller.update)
	// remove tag by id
	.delete(isAuth, rbac('tags', 'delete'), controller.delete);

module.exports = router;
