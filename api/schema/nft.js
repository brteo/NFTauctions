module.exports = {
	nft: {
		$id: 'nft',
		type: 'object',
		properties: {
			title: { type: 'string' },
			description: { type: 'string' },
			category: {
				$ref: 'objectId'
			},
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
		required: ['title', 'description', 'tags', 'url']
	},
	nftId: {
		type: 'object',
		properties: {
			id: { type: 'string', pattern: '^[0-9]+' }
		}
	}
};
