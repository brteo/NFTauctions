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
				items: { $ref: 'tag' }
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
