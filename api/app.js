/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const response = require('./middlewares/response');
const passport = require('./middlewares/passport');
const trimmer = require('./middlewares/trimmer');

const { SendData, NotFound } = require('./helpers/response');

const app = express();
app.use(cors({ credentials: true, origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(trimmer());
app.use(passport());

app.get('/', (req, res, next) => next(SendData({ message: 'RestAPI is live!' })));

// dynamic routes for express
fs.readdirSync(path.join(__dirname, '/routes'))
	.filter(file => file.indexOf('.') !== 0 && file.slice(-3) === '.js')
	.forEach(file => {
		const f = path.parse(file).name;
		app.use(`/${f}`, require(`./routes/${f}`));
	});

app.all('*', (req, res, next) => next(NotFound()));

app.use((toSend, req, res, next) => response(toSend, res));

module.exports = app;
