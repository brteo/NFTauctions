module.exports = {
	tag: {
		$id: 'tag',
		type: 'object',
		properties: {
			name: { type: 'string' }
		},
		required: ['name'],
		additionalProperties: false
	}
};
