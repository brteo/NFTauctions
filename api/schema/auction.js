module.exports = {
	auction: {
		$id: 'auction',
		type: 'object',
		properties: {
			basePrice: { type: 'float64', minimum: 1.0 },
			deadlineTimestamp: { type: 'timestamp' },
			nft: { type: 'string' }
		},
		additionalProperties: false
	},
	addAuction: {
		type: 'object',
		allOf: [{ $ref: 'auction' }],
		required: ['basePrice', 'deadlineTimestamp', 'nft']
	}
};
