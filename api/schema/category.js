module.exports = {
	category: {
		$id: 'category',
		type: 'object',
		properties: {
			name: {
				type: 'object',
				properties: {
					'^[a-z]{2}$': { type: 'string' }
				}
			}
		},
		required: ['name'],
		additionalProperties: false
	}
};
