// eslint-disable-next-line no-undef
db.createUser({
	user: 'user',
	pwd: 'user0201',
	roles: [
		{ role: 'dbOwner', db: 'tradingvg' },
		{ role: 'readWrite', db: 'tradingvg' }
	]
});
