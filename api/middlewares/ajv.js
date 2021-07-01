const Ajv = require('ajv');
const { NotAcceptable } = require('../helpers/response');

const ajv = new Ajv();

const tagSchema = {
	type: 'object',
	properties: {
		name: { type: 'string' }
	},
	required: ['name'],
	additionalProperties: false
};

const categorySchema = {
	type: 'object',
	properties: {
		name: { type: 'string' }
	},
	required: ['name'],
	additionalProperties: false
};

const auctionSchema = {
	type: 'object',
	properties: {
		title: { type: 'string' },
		description: { type: 'string' },
		category: { type: 'string' },
		tags: { type: 'array', items: { type: 'string' } },
		image: { type: 'string' }
	},
	required: ['title', 'description', 'category', 'tags', 'image']
};

const tagSchemaCompiled = ajv.compile(tagSchema);
const categorySchemaCompiled = ajv.compile(categorySchema);
const auctionSchemaCompiled = ajv.compile(auctionSchema);

exports.tagValidator = (req, res, next) => {
	const valid = tagSchemaCompiled(req.body);

	if (!valid) next(NotAcceptable());
	next();
};

exports.categoryValidator = (req, res, next) => {
	const valid = categorySchemaCompiled(req.body);

	if (!valid) next(NotAcceptable());
	next();
};

exports.auctionValidator = (req, res, next) => {
	const valid = auctionSchemaCompiled(req.body);

	if (!valid) next(NotAcceptable());
	next();
};
