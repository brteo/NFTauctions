module.exports = {
	user: {
		$id: 'user',
		type: 'object',
		properties: {
			email: { type: 'string', format: 'email' },
			password: { type: 'string' },
			account: { type: 'string' },
			nickname: { type: 'string' },
			name: { type: 'string' },
			lastname: { type: 'string' },
			birthdate: { type: 'string', format: 'date' },
			bio: { type: 'string' },
			pic: { type: 'string' },
			header: { type: 'string' },
			lang: { type: 'string' }
		},
		additionalProperties: false,
		errorMessage: {
			properties: {
				email: '210'
			}
		}
	}
};
