// eslint-disable-next-line no-undef
db.createUser({
	user: 'user',
	pwd: 'user0201',
	roles: [
		{ role: 'dbOwner', db: 'test' },
		{ role: 'restore', db: 'admin' },
		{ role: 'backup', db: 'admin' },
		{ role: 'readWrite', db: 'test' }
	]
});
