module.exports = {
	bet: {
		$id: 'bet',
		type: 'object',
		properties: {
			price: { type: 'string', pattern: '^[0-9]+(.[0-9]{0,2})?' }
		},
		required: ['price'],
		additionalProperties: false
	}
};
