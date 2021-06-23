/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const express = require('express');
const path = require('path');
const fs = require('fs');
require('./db/connect');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
	const response = { message: `RestAPI is live!` };
	res.send(response);
});

// dynamic routes for express
fs.readdirSync(path.join(__dirname, '/routes'))
	.filter(file => file.indexOf('.') !== 0 && file.slice(-3) === '.js')
	.forEach(file => {
		const f = path.parse(file).name;
		app.use(`/${f}`, require(`./routes/${f}`));
	});

app.listen(3000);
