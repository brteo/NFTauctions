/* eslint-disable no-console */
const mongoose = require('mongoose');

mongoose
	.connect('mongodb://user:user0201@mongo:27017/' + process.env.MONGO_INITDB_DATABASE, {
		useNewUrlParser: true,
		useUnifiedTopology: true.valueOf,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then(() => {
		console.log('Mongo DB connected!');
	})
	.catch(() => {
		console.error('Mongo DB non connected!');
	});

module.exports = mongoose.connection;
