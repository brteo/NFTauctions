const express = require('express');
const { login, check, refreshToken, logout } = require('../controllers/auth');
const { isAuth, isAuthRt } = require('../middlewares/isAuth');

const router = express.Router();

router.post('/login', login);

router.get('/check', isAuth, check);

router.get('/rt', isAuthRt, refreshToken);

router.get('/logout', isAuthRt, logout);

module.exports = router;
