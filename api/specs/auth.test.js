const supertest = require('supertest');
const app = require('../app');
const db = require('../db/connect-test');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

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
				expect(res.body).toEqual(expect.objectContaining({ error: 300 }));
			});
	});

	test('Wrong email', async () => {
		await seedUser();

		return agent
			.post('/auth/login')
			.send({ email: 'wrong@email.it', password: 'wrongpwd' })
			.expect(400)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ error: 301 }));
			});
	});

	test('Wrong password', async () => {
		await seedUser();

		return agent
			.post('/auth/login')
			.send({ email: 'test@meblabs.com', password: 'wrongpwd' })
			.expect(400)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ error: 302 }));
			});
	});

	test('Inactive account', async () => {
		await seedUser(false, false);

		return agent
			.post('/auth/login')
			.send({ email: 'test@meblabs.com', password: 'testtest' })
			.expect(401)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ error: 303 }));
			});
	});

	test('Deleted account', async () => {
		await seedUser(true, true);

		return agent
			.post('/auth/login')
			.send({ email: 'test@meblabs.com', password: 'testtest' })
			.expect(400)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ error: 307 }));
			});
	});
});

describe('Login Auth', () => {
	test('Login successfully', async () => {
		await seedUser();
		let token;

		await agent
			.post('/auth/login')
			.send({ email: 'test@meblabs.com', password: 'testtest' })
			.expect(200)
			.then(res => {
				expect(res.body.token).toBeTruthy();
				token = res.body.token;
			});

		return agent
			.get('/auth/check')
			.set('Authorization', 'bearer ' + token)
			.expect(200)
			.then(res => {
				expect(res.body.message).toBe('Token valid!');
			});
	});

	test('Check without token should be unauthorized', async () => {
		return agent
			.get('/auth/check')
			.expect(401)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ error: 401 }));
			});
	});

	test('Check with invalid token should be unauthorized', async () => {
		const token = jwt.sign(
			{
				id: 1,
				iat: Math.floor(Date.now() / 1000)
			},
			process.env.JWT_SECRET,
			{
				expiresIn: parseInt(process.env.JWT_EXPIRES_TIME)
			}
		);
		return agent
			.get('/auth/check')
			.set('Authorization', 'bearer ' + token)
			.expect(401)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ error: 401 }));
			});
	});
});
