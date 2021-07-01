const express = require('express');
const controller = require('../controllers/users');
const { isAuth } = require('../middlewares/isAuth');
const rbac = require('../middlewares/rbac');

const router = express.Router();

router
	.route('/')
	// get
	.get(isAuth, rbac('users', 'read:any'), controller.get)
	// add
	.post(isAuth, rbac('users', 'create:any'), controller.add);

router
	.route('/:id')
	// get by id
	.get(isAuth, rbac('users', 'read'), controller.getById)
	// put
	.put(isAuth, rbac('users', 'update'), controller.update)
	// delete
	.delete(isAuth, rbac('users', 'delete'), controller.delete);

module.exports = router;
