const express = require('express');
const { login, check, checkIfEmailExists, register, refreshToken, logout } = require('../controllers/auth');
const { isAuth, isAuthRt } = require('../middlewares/isAuth');
const { validator } = require('../middlewares/validator');

const router = express.Router();

router.post('/login', validator('loginAuth'), login);

router.get('/check', isAuth, check);

router.get('/email/:email?', validator({ params: 'emailAuth' }), checkIfEmailExists);

router.post('/register', validator('registerAuth'), register);

router.get('/rt', isAuthRt, refreshToken);

router.get('/logout', isAuthRt, logout);

module.exports = router;
