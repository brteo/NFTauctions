const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const config = require('./config');

const mongoServer = new MongoMemoryServer();

const connect = async () => {
	// Prevent MongooseError: Can't call `openUri()` on
	// an active connection with different connection strings
	await mongoose.disconnect();

	const mongoUri = await mongoServer.getUri();
	mongoose.connect(mongoUri, config, err => {
		if (err) {
			console.error('[MongoDB-TEST]', err);
		}
	});
};

const close = async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
};

const clear = async () => {
	const { collections } = mongoose.connection;

	Object.keys(collections).forEach(async key => {
		await collections[key].deleteMany();
	});
};

module.exports = {
	connect,
	close,
	clear
};
