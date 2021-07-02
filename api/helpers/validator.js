/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const { NotAcceptable, NotFound } = require('./response');

const ajv = new Ajv();

const validatorPath = `${__dirname}/../schema/`;
const validator = fs
	.readdirSync(validatorPath)
	.filter(file => file.split('.')[1] === 'json')
	.reduce((acc, file) => {
		const f = path.parse(file).name;
		acc[f] = require(`${validatorPath}${f}.json`);
		return acc;
	}, {});

exports.validate = (schemaName, req, next) =>
	new Promise((resolve, reject) => {
		if (schemaName in validator) {
			const schemaCompiled = ajv.compile(validator[schemaName]);
			const valid = schemaCompiled(req.body);

			if (!valid) reject(NotAcceptable());

			resolve();
		}

		reject(NotFound());
	});
