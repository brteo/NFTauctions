module.exports = {
	bet: {
		$id: 'bet',
		type: 'object',
		properties: {
			price: { type: 'string' }
		},
		required: ['price'],
		additionalProperties: false
	}
};
