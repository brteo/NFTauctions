const express = require('express');
const controller = require('../controllers/categories');
const { validator } = require('../middlewares/validator');
const rbac = require('../middlewares/rbac');
const { isAuth } = require('../middlewares/isAuth');

const router = express.Router();

router
	.route('/')
	// get all categories
	.get(isAuth, rbac('categories', 'read:any'), controller.get)
	// add new category
	.post(isAuth, rbac('categories', 'create:any'), validator('category'), controller.add);

router
	.route('/:id')
	// get category by id
	.get(isAuth, rbac('categories', 'read'), controller.getById)
	// update category by id
	.put(isAuth, rbac('categories', 'update'), validator('category'), controller.update)
	// remove category by id
	.delete(isAuth, rbac('categories', 'delete'), controller.delete);

module.exports = router;
