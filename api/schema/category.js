module.exports = {
	category: {
		$id: 'category',
		type: 'object',
		properties: {
			name: { type: 'string' }
		},
		required: ['name'],
		additionalProperties: false
	}
};
