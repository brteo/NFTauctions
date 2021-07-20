const express = require('express');
const controller = require('../controllers/tags');
const { isAuth } = require('../middlewares/isAuth');
const rbac = require('../middlewares/rbac');
const { validator } = require('../middlewares/validator');

const router = express.Router();

router
	.route('/')
	.get(isAuth, rbac('tags', 'read:any'), controller.get)
	.post(validator('tag'), isAuth, rbac('tags', 'create:any'), controller.add);

router
	.route('/:id')
	.get(validator({ params: 'objectId' }), isAuth, rbac('tags', 'read'), controller.getById)
	.put(validator({ params: 'objectId', body: 'tag' }), isAuth, rbac('tags', 'update'), controller.update)
	.delete(validator({ params: 'objectId' }), isAuth, rbac('tags', 'delete'), controller.delete);

module.exports = router;
