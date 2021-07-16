module.exports = {
	nft: {
		$id: 'nft',
		type: 'object',
		properties: {
			title: { type: 'string' },
			description: { type: 'string' },
			category: { $ref: 'category' },
			tags: {
				type: 'array',
				items: { type: 'string' }
			},
			url: { type: 'string' }
		},
		additionalProperties: false
	},
	createNft: {
		type: 'object',
		allOf: [{ $ref: 'nft' }],
		required: ['title', 'description', 'category', 'tags', 'url']
	}
};
