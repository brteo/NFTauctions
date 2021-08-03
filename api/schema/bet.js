module.exports = {
	bet: {
		$id: 'bet',
		type: 'object',
		properties: {
			price: { type: 'number', multipleOf: 0.01 }
		},
		required: ['price'],
		additionalProperties: false
	}
};
