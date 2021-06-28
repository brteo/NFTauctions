const User = require('../models/user');
const { SendData, ServerError } = require('../helpers/response');

exports.get = (req, res, next) => {
	User.find({}, (err, doc) => {
		if (err) next(ServerError());
		else next(SendData(doc));
	});
};

exports.getById = (req, res, next) => {
	User.findById(req.params.id, (err, doc) => {
		if (err) next(ServerError());
		else next(SendData(doc));
	});
};

exports.add = (req, res, next) => {
	const user = new User(req.body);
	user.save((err, doc) => {
		if (err) next(ServerError());
		else next(SendData(doc, 201));
	});
};

exports.update = (req, res, next) => {
	User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, doc) => {
		if (err) next(ServerError());
		else next(SendData(doc));
	});
};

exports.delete = (req, res, next) => {
	User.findByIdAndUpdate(req.params.id, { deleted: true, active: false }, { new: true }, (err, doc) => {
		if (err) next(ServerError());
		else next(SendData(doc));
	});
};
