const express = require('express');
const controller = require('../controllers/search');
const { validator } = require('../middlewares/validator');

const router = express.Router();

router.route('/:query').get(controller.search);

module.exports = router;
