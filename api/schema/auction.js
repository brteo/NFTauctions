module.exports = {
	auction: {
		$id: 'auction',
		type: 'object',
		properties: {
			description: { type: 'string' },
			basePrice: { type: 'number', multipleOf: 0.01 },
			deadline: {
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
		required: ['description', 'basePrice', 'deadline', 'nft']
	}
};
