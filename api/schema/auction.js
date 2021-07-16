module.exports = {
	auction: {
		$id: 'auction',
		type: 'object',
		properties: {
			description: { type: 'string' },
			basePrice: { type: 'integer' },
			deadlineTimestamp: {
				type: 'string',
				format: 'date-time'
			},
			nft: { type: 'string' }
		},
		additionalProperties: false
	},
	addAuction: {
		type: 'object',
		allOf: [{ $ref: 'auction' }],
		required: ['description', 'basePrice', 'deadlineTimestamp', 'nft']
	}
};
