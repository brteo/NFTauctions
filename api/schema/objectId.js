module.exports = {
	objectId: {
		type: 'object',
		properties: {
			id: { type: 'string', pattern: '^[a-f\\d]{24}$' }
		}
	}
};
