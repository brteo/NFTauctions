const express = require('express');
const controller = require('../controllers/users');
const { isAuth } = require('../middlewares/isAuth');
const rbac = require('../middlewares/rbac');
const { validator } = require('../middlewares/validator');

const router = express.Router();

router.route('/').get(isAuth, rbac('users', 'read:any'), controller.get);

router
	.route('/:id')
	.get(validator({ params: 'objectId' }), isAuth, rbac('users', 'read'), controller.getById)
	.patch(validator({ body: 'user', params: 'objectId' }), isAuth, rbac('users', 'update'), controller.update)
	.delete(validator({ params: 'objectId' }), isAuth, rbac('users', 'delete'), controller.delete);

router.route('/:id/pic').get(validator({ params: 'objectId' }), controller.getPic);

module.exports = router;
