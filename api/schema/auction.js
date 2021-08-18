module.exports = {
	auction: {
		$id: 'auction',
		type: 'object',
		properties: {
			description: { type: 'string' },
			basePrice: { type: 'string', pattern: '^[0-9]+(.[0-9]{0,2})?' },
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
		required: ['basePrice', 'deadline', 'nft']
	}
};
