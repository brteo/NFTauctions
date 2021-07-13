module.exports = {
	user: {
		$id: 'user',
		type: 'object',
		properties: {
			email: { type: 'string', format: 'email' },
			password: { type: 'string' },
			name: { type: 'string' },
			lastname: { type: 'string' },
			birthdate: { type: 'string', format: 'date' }
		},
		additionalProperties: false
	},
	addUser: {
		type: 'object',
		allOf: [{ $ref: 'user' }],
		required: ['email', 'password']
	}
};
