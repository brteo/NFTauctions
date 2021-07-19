module.exports = {
	auth: {
		$id: 'auth',
		type: 'object',
		properties: {
			email: { type: 'string', format: 'email' },
			password: { type: 'string' },
			account: { type: 'string' }
		},
		additionalProperties: false
	},
	loginAuth: {
		type: 'object',
		allOf: [{ $ref: 'auth' }],
		required: ['email', 'password']
	},
	emailAuth: {
		type: 'object',
		allOf: [{ $ref: 'auth' }],
		required: ['email']
	},
	registerAuth: {
		type: 'object',
		allOf: [{ $ref: 'auth' }],
		required: ['email', 'password']
	}
};
