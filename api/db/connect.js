const mongoose = require('mongoose');
const config = require('./config');

const { ENV, MONGO_INITDB_DATABASE, MONGO_DATABASE_USERNAME, MONGO_DATABASE_PASSWORD } = process.env;

if (ENV === 'development') mongoose.set('debug', true);

mongoose
	.connect(
		'mongodb://' + MONGO_DATABASE_USERNAME + ':' + MONGO_DATABASE_PASSWORD + '@mongo:27017/' + MONGO_INITDB_DATABASE,
		config
	)
	.then(() => {
		console.log('[MongoDB] CONNECTED!');
	})
	.catch(() => {
		console.error('[MongoDB] ERRROR: NON CONNECTED!');
	});

module.exports = mongoose.connection;
