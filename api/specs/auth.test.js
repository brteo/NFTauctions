const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const app = require('../app');
const db = require('../db/connect-test');
const User = require('../models/user');

let agent;

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

const seedUser = async (active = true, deleted = false) => await new User(userInfo(active, deleted)).save();

beforeAll(async () => await db.connect());
beforeEach(async () => {
	await db.clear();
	agent = supertest.agent(app);
});
afterAll(async () => await db.close());

describe('POST /auth/login', () => {
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

	test('Login successfully', async () => {
		await seedUser();

		return agent
			.post('/auth/login')
			.send({ email: 'test@meblabs.com', password: 'testtest' })
			.expect(200)
			.then(res => {
				expect(res.headers['set-cookie']).toEqual(expect.arrayContaining([expect.any(String), expect.any(String)]));
				expect(res.body).toEqual(expect.objectContaining({ email: userInfo().email }));
			});
	});
});

describe('GET /auth/check', () => {
	test('Check with valid token should be OK', async () => {
		await seedUser();

		await agent
			.post('/auth/login')
			.send({ email: 'test@meblabs.com', password: 'testtest' })
			.expect(200)
			.then(res => {
				expect(res.headers['set-cookie']).toEqual(expect.arrayContaining([expect.any(String), expect.any(String)]));
				expect(res.body).toEqual(expect.objectContaining({ email: userInfo().email }));
			});

		return agent
			.get('/auth/check')
			.expect(200)
			.then(res => {
				expect(res.body.id).toBeTruthy();
			});
	});

	test('Check without token should be unauthorized', async () =>
		agent
			.get('/auth/check')
			.expect(401)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ error: 401 }));
			}));

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
			.set('Cookie', `TvgAccessToken=${token}`)
			.expect(401)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ error: 401 }));
			});
	});
});

describe('GET /auth/email/:email', () => {
	test('Check if email exist should be OK', async () => {
		await seedUser();

		return agent
			.get('/auth/email/' + userInfo().email)
			.expect(200)
			.then(res => {
				expect(res.body.message).toBe('Email exists!');
			});
	});

	test('Check if email exist should be Not Found', async () =>
		agent
			.get('/auth/email/' + userInfo().email)
			.expect(404)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
			}));

	test('Check if deleted users email exist should be Not Found', async () => {
		await seedUser(true, true);

		return agent
			.get('/auth/email/' + userInfo().email)
			.expect(404)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
			});
	});

	test.todo('Check without email should be ValidationError');
	test.todo('Check with incorrect email should be InvalidEmail');
});

describe('GET /auth/register', () => {
	test('Register new user with email and password should be OK and response with auth token + refresh token', async () => {
		await agent
			.post('/auth/register')
			.send({ email: 'test@meblabs.com', password: 'testtest' })
			.expect(200)
			.then(res => {
				expect(res.headers['set-cookie']).toEqual(expect.arrayContaining([expect.any(String), expect.any(String)]));
				expect(res.body).toEqual(expect.objectContaining({ email: userInfo().email }));
			});

		return agent
			.get('/auth/check')
			.expect(200)
			.then(res => {
				expect(res.body.id).toBeTruthy();
			});
	});

	test('Register new user with email that already exist should be EmailAlreadyExists', async () => {
		await seedUser();

		return agent
			.post('/auth/register')
			.send({ email: 'test@meblabs.com', password: 'testtest' })
			.expect(400)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ error: 202 }));
			});
	});

	test.todo('Register new user without email should be ValidationError');
	test.todo('Register new user with incorrect email should be InvalidEmail');
	test.todo('Register new user without password should be ValidationError');
});

describe('GET /auth/rt', () => {
	test('Get new auth with valid refresh token should be OK', async () => {
		const user = await seedUser();

		await agent
			.post('/auth/login')
			.send({ email: 'test@meblabs.com', password: 'testtest' })
			.expect(200)
			.then(res => {
				expect(res.headers['set-cookie']).toEqual(expect.arrayContaining([expect.any(String), expect.any(String)]));
				expect(res.body).toEqual(expect.objectContaining({ email: userInfo().email }));
			});

		await agent
			.get('/auth/rt')
			.expect(200)
			.then(res => {
				expect(res.headers['set-cookie']).toEqual(expect.arrayContaining([expect.any(String), expect.any(String)]));
				expect(res.body).toEqual(expect.objectContaining({ email: userInfo().email }));
			});

		await agent
			.get('/auth/check')
			.expect(200)
			.then(res => {
				expect(res.body.id).toBeTruthy();
			});

		try {
			const refreshUser = await User.findById(user._id).exec();
			expect(refreshUser.rt.length).toEqual(1);
		} catch (e) {
			throw new Error(e);
		}
	});

	test('Get new auth with invalid refresh should be Unauthorized', async () => {
		await seedUser();
		const rt = jwt.sign(
			{
				userID: 1,
				rt: 1234,
				iat: Math.floor(Date.now() / 1000)
			},
			process.env.JWT_SECRET,
			{
				expiresIn: parseInt(process.env.JWT_EXPIRES_TIME)
			}
		);

		return agent
			.get('/auth/rt')
			.set('Cookie', `TvgRefreshToken=${rt}`)
			.expect(401)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ error: 401 }));
			});
	});

	test('Get new auth with expired refresh should be Unauthorized', async () => {
		const user = await seedUser();

		await agent
			.post('/auth/login')
			.send({ email: 'test@meblabs.com', password: 'testtest' })
			.expect(200)
			.then(res => {
				expect(res.headers['set-cookie']).toEqual(expect.arrayContaining([expect.any(String), expect.any(String)]));
				expect(res.body).toEqual(expect.objectContaining({ email: userInfo().email }));
			});

		try {
			const refreshUser = await User.findById(user._id).exec();
			refreshUser.rt[0].expires = moment().subtract(1, 's').format();
			await refreshUser.save();
		} catch (e) {
			throw new Error(e);
		}

		return agent
			.get('/auth/rt')
			.expect(401)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ error: 310 }));
			});
	});

	test('Get new auth with valid refresh but already used token should be remove all refreshToken and set authReset', async () => {
		const user = await seedUser();
		let rt;

		// login
		await agent
			.post('/auth/login')
			.send({ email: 'test@meblabs.com', password: 'testtest' })
			.expect(200)
			.then(res => {
				expect(res.headers['set-cookie']).toEqual(expect.arrayContaining([expect.any(String), expect.any(String)]));
				// eslint-disable-next-line prefer-destructuring
				rt = res.headers['set-cookie'][1].split(';')[0].split('=')[1];
				expect(res.body).toEqual(expect.objectContaining({ email: userInfo().email }));
			});

		// get new auth by refresh token
		await agent
			.get('/auth/rt')
			.expect(200)
			.then(res => {
				expect(res.headers['set-cookie']).toEqual(expect.arrayContaining([expect.any(String), expect.any(String)]));
				expect(res.body).toEqual(expect.objectContaining({ email: userInfo().email }));
			});

		// get new auth by already userd refresh token
		const malwareAgent = supertest.agent(app);
		await malwareAgent
			.get('/auth/rt')
			.set('Cookie', `TvgRefreshToken=${rt}`)
			.expect(401)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ error: 306 }));
			});

		// check if all user's refresh token are removed and authReset is set
		try {
			const refreshUser = await User.findById(user._id).exec();
			expect(refreshUser.authReset).toBeTruthy();
			expect(refreshUser.rt.length).toEqual(0);
		} catch (e) {
			throw new Error(e);
		}

		// old yet valid token must be blocked by authReset
		await agent
			.get('/auth/check')
			.expect(401)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ error: 305 }));
			});

		// login is blocked  must be blocked by authReset
		return agent
			.post('/auth/login')
			.send({ email: 'test@meblabs.com', password: 'testtest' })
			.expect(401)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ error: 305 }));
			});
	});
});

describe('GET /auth/logout', () => {
	test('Destroy refresh token on logout and clear http only cookie', async () => {
		const user = await seedUser();

		await agent
			.post('/auth/login')
			.send({ email: 'test@meblabs.com', password: 'testtest' })
			.expect(200)
			.then(res => {
				expect(res.headers['set-cookie']).toEqual(expect.arrayContaining([expect.any(String), expect.any(String)]));
				expect(res.body).toEqual(expect.objectContaining({ email: userInfo().email }));
			});

		await agent
			.get('/auth/logout')
			.expect(200)
			.then(res => {
				expect(res.body.message).toBe('Logout succesfully!');
			});

		try {
			const refreshUser = await User.findById(user._id).exec();
			expect(refreshUser.authReset).not.toBeDefined();
			expect(refreshUser.rt.length).toEqual(0);
		} catch (e) {
			throw new Error(e);
		}
	});
});
