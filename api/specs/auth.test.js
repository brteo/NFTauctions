const supertest = require('supertest');
const app = require('../app');
const db = require('../db/connect-test');
const User = require('../models/user');

const agent = supertest.agent(app);

const userInfo = (active = 1, deleted = 0) => {
	const info = {
		email: 'test@meblabs.com',
		password: 'testtest',
		name: 'John',
		lastname: 'Doe',
		active,
		deleted
	};
	return info;
};

const seedUser = async (active = true, deleted = false) => {
	await new User(userInfo(active, deleted)).save();
};

beforeAll(async () => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async () => await db.close());

describe('Login Errors', () => {
	test('Missing credentials', async () => {
		await seedUser();

		return agent
			.post('/auth/login')
			.expect(400)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ message: 'Missing credentials', error: 300 }));
			});
	});

	test('Wrong email', async () => {
		await seedUser();

		return agent
			.post('/auth/login')
			.send({ email: 'wrong@email.it', password: 'wrongpwd' })
			.expect(400)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ message: 'Wrong email', error: 301 }));
			});
	});

	test('Wrong password', async () => {
		await seedUser();

		return agent
			.post('/auth/login')
			.send({ email: 'test@meblabs.com', password: 'wrongpwd' })
			.expect(400)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ message: 'Wrong password', error: 302 }));
			});
	});

	test('Inactive account', async () => {
		await seedUser(false, false);

		return agent
			.post('/auth/login')
			.send({ email: 'test@meblabs.com', password: 'testtest' })
			.expect(401)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ message: 'Inactive account', error: 303 }));
			});
	});

	test('Deleted account', async () => {
		await seedUser(true, true);

		return agent
			.post('/auth/login')
			.send({ email: 'test@meblabs.com', password: 'testtest' })
			.expect(400)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ message: 'Deleted account', error: 307 }));
			});
	});
});

describe('Login Auth', () => {
	test.todo('login successfully');
	test.todo('auth middleware check');
});
