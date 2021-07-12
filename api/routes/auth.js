const express = require('express');
const { login, check, checkIfEmailExists, register, refreshToken, logout } = require('../controllers/auth');
const { isAuth, isAuthRt, isAuthRtlogout } = require('../middlewares/isAuth');

const router = express.Router();

router.post('/login', login);

router.get('/check', isAuth, check);

router.get('/email/:email', checkIfEmailExists);

router.post('/register', register);

router.get('/rt', isAuthRt, refreshToken);

router.get('/logout', isAuthRtlogout, logout);

module.exports = router;
