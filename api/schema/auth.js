module.exports = {
	auth: {
		$id: 'auth',
		type: 'object',
		properties: {
			email: { type: 'string', format: 'email' },
			password: { type: 'string' },
			account: { type: 'string', pattern: '^[a-z1-5.]{1,12}$' },
			nickname: { type: 'string' },
			lang: { type: 'string' }
		},
		additionalProperties: false,
		errorMessage: {
			properties: {
				email: '210',
				account: '211'
			}
		}
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
		required: ['email', 'password', 'nickname', 'account']
	}
};
