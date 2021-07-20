const express = require('express');
const controller = require('../controllers/categories');
const { validator } = require('../middlewares/validator');
const rbac = require('../middlewares/rbac');
const { isAuth } = require('../middlewares/isAuth');

const router = express.Router();

router
	.route('/')
	.get(isAuth, rbac('categories', 'read:any'), controller.get)
	.post(validator('category'), isAuth, rbac('categories', 'create:any'), controller.add);

router
	.route('/:id')
	.get(validator({ params: 'objectId' }), isAuth, rbac('categories', 'read'), controller.getById)
	.put(validator({ params: 'objectId', body: 'category' }), isAuth, rbac('categories', 'update'), controller.update)
	.delete(validator({ params: 'objectId' }), isAuth, rbac('categories', 'delete'), controller.delete);

module.exports = router;
