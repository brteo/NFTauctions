module.exports = {
	auction: {
		$id: 'auction',
		type: 'object',
		properties: {
			title: { type: 'string' },
			description: { type: 'string' },
			category: { $ref: 'category' },
			tags: {
				type: 'array',
				items: { $ref: 'tag' }
			},
			image: { type: 'string' }
		},
		additionalProperties: false
	},
	addAuction: {
		type: 'object',
		allOf: [{ $ref: 'auction' }],
		required: ['title', 'description', 'category', 'tags', 'image']
	}
};
