/* eslint-disable no-console */
const mongoose = require('mongoose');

const { MONGO_INITDB_DATABASE, MONGO_DATABASE_USERNAME, MONGO_DATABASE_PASSWORD } = process.env;

mongoose
	.connect(
		'mongodb://' + MONGO_DATABASE_USERNAME + ':' + MONGO_DATABASE_PASSWORD + '@mongo:27017/' + MONGO_INITDB_DATABASE,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true.valueOf,
			useCreateIndex: true,
			useFindAndModify: false
		}
	)
	.then(() => {
		console.log('[MongoDB] CONNECTED!');
	})
	.catch(() => {
		console.error('[MongoDB] ERRROR: NON CONNECTED!');
	});

module.exports = mongoose.connection;
