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
			nft: { type: 'integer' }
		},
		additionalProperties: false
	},
	addAuction: {
		type: 'object',
		allOf: [{ $ref: 'auction' }],
		required: ['description', 'basePrice', 'deadlineTimestamp', 'nft']
	}
};
