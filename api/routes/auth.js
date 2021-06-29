const express = require('express');
const { login, check } = require('../controllers/auth');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

router.post('/login', login);

router.get('/check', isAuth, check);

module.exports = router;
