const express = require('express');
const { login, check, refreshToken } = require('../controllers/auth');
const { isAuth, isAuthRt } = require('../middlewares/isAuth');

const router = express.Router();

router.post('/login', login);

router.get('/check', isAuth, check);

router.get('/rt', isAuthRt, refreshToken);

module.exports = router;
