/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const { createServer } = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const socketIo = require('socket.io');

const response = require('./middlewares/response');
const passport = require('./middlewares/passport');
const trimmer = require('./middlewares/trimmer');

const { SendData, NotFound } = require('./helpers/response');

const app = express();

const server = createServer(app);
const io = socketIo(server, { cors: { origin: process.env.CORS_ORIGIN } });

app.use(cors({ credentials: true, origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(trimmer());
app.use(passport());
app.use((req, res, next) => {
	req.io = io;
	return next();
});

app.get('/', (req, res, next) => next(SendData({ message: 'RestAPI is live!' })));

fs.readdirSync(path.join(__dirname, '/routes'))
	.filter(file => file.indexOf('.') !== 0 && file.slice(-3) === '.js')
	.forEach(file => {
		const f = path.parse(file).name;
		app.use(`/${f}`, require(`./routes/${f}`));
	});

app.all('*', (req, res, next) => next(NotFound()));

app.use((toSend, req, res, next) => response(toSend, res));

module.exports = server; // for socket export server and not app
