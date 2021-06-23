const User = require('../models/user');

exports.get = (req, res) => {
	User.find({}, (err, doc) => {
		if (err) res.status(500).json(err);
		else res.json(doc);
	});
};

exports.getById = (req, res) => {
	User.findById(req.params.id, (err, doc) => {
		if (err) res.status(500).json(err);
		else res.json(doc);
	});
};

exports.add = (req, res) => {
	const user = new User(req.body);
	user.save((err, doc) => {
		if (err) res.status(500).json(err);
		else res.json(doc);
	});
};

exports.update = (req, res) => {
	User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, doc) => {
		if (err) res.status(500).json(err);
		else res.json(doc);
	});
};

exports.delete = (req, res) => {
	User.findByIdAndUpdate(req.params.id, { deleted: true, active: false }, { new: true }, (err, doc) => {
		if (err) res.status(500).json(err);
		else res.json(doc);
	});
};
