const express = require('express');
const controller = require('../controllers/profile');
const { isAuth } = require('../middlewares/isAuth');
const rbac = require('../middlewares/rbac');
const { validator } = require('../middlewares/validator');

const router = express.Router();

router.route('/').get(controller.get);
router.route('/filter/:filter').get(controller.filter);

router
	.route('/:id')
	.get(validator({ params: 'objectId' }), controller.getById)
	.put(validator({ body: 'user', params: 'objectId' }), isAuth, rbac('profile', 'update:own'), controller.update);

router.route('/:id/owned').get(validator({ params: 'objectId' }), controller.getOwned);

router.route('/:id/created').get(validator({ params: 'objectId' }), controller.getCreated);

module.exports = router;
