module.exports = {
	category: {
		$id: 'category',
		type: 'object',
		properties: {
			name: {
				type: 'object',
				properties: {
					it: { type: 'string' },
					en: { type: 'string' }
				}
			}
		},
		required: ['name'],
		additionalProperties: false
	}
};
