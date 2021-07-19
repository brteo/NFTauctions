const express = require('express');
const controller = require('../controllers/users');
const { isAuth } = require('../middlewares/isAuth');
const rbac = require('../middlewares/rbac');
const { validator } = require('../middlewares/validator');

const router = express.Router();

router
	.route('/')
	.get(isAuth, rbac('users', 'read:any'), controller.get)
	.post(isAuth, rbac('users', 'create:any'), validator('addUser'), controller.add);

router
	.route('/:id')
	.get(validator({ params: 'objectId' }), isAuth, rbac('users', 'read'), controller.getById)
	.put(
		validator({ body: 'user', params: 'objectId' }),
		isAuth,
		rbac('users', 'update'),
		validator('user'),
		controller.update
	)
	.delete(validator({ params: 'objectId' }), isAuth, rbac('users', 'delete'), controller.delete);

module.exports = router;
