const supertest = require('supertest');

const app = require('../app');
const db = require('../db/connect-test');
const User = require('../models/user');
const { genereteAuthToken } = require('../helpers/auth');

const agent = supertest.agent(app);

let admin;
let adminToken;
let user;
let userToken;

beforeAll(async () => await db.connect());
beforeEach(async () => {
	await db.clear();

	admin = await new User({
		email: 'admin@meblabs.com',
		password: 'testtest',
		account: 'admin1234',
		nickname: 'Admin',
		name: 'Super',
		lastname: 'Admin',
		role: 'admin',
		active: 1
	}).save();
	adminToken = genereteAuthToken(admin).token;

	user = await new User({
		email: 'user@meblabs.com',
		password: 'testtest',
		account: 'user4321',
		nickname: 'DormiPaglia',
		name: 'John',
		lastname: 'Doe',
		role: 'user',
		active: 1
	}).save();
	userToken = genereteAuthToken(user).token;
});
afterEach(() => jest.clearAllMocks());
afterAll(async () => await db.close());

/*
 * Admin Role
 */
describe('Role: admin', () => {
	describe('GET /users', () => {
		test('Get all and should contains two users', done => {
			agent
				.get('/users')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.length).toBe(2);
					done();
				});
		});

		test('Get any specific userId should be done with correct public fields', done => {
			agent
				.get('/users/' + user.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					const { email, name, lastname } = user;
					const { _id, role } = res.body;
					expect(res.body).toMatchObject({ _id, email, name, lastname, role });
					done();
				});
		});

		test('Get wrong userId should be Validation Error', done => {
			agent
				.get('/users/1234')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 200 }));
					done();
				});
		});

		test('Get inexistent userId should be not found', done => {
			agent
				.get('/users/507f1f77bcf86cd799439011')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					done();
				});
		});

		test('Get deleted user should be not found', async () => {
			await agent
				.delete('/users/' + user.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'edit' })
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('User deleted sucessfully!');
				});

			return agent
				.get('/users/' + user.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
				});
		});
	});

	describe('PUT /users', () => {
		test('His data should be changed', done => {
			agent
				.put('/users/' + admin.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'edit' })
				.expect(200)
				.then(res => {
					const { email, lastname } = admin;
					expect(res.body).toEqual(expect.objectContaining({ email, name: 'edit', lastname }));
					done();
				});
		});

		test('Any users should be changed', done => {
			agent
				.put('/users/' + user.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'edit' })
				.expect(200)
				.then(res => {
					const { email, lastname } = user;
					expect(res.body).toEqual(expect.objectContaining({ email, name: 'edit', lastname }));
					done();
				});
		});

		test('Update wrong userId should be Validation Error', done => {
			agent
				.put('/users/1234')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'edit' })
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 200 }));
					done();
				});
		});

		test('Update inexistent userId should be not found', done => {
			agent
				.put('/users/507f1f77bcf86cd799439011')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'edit' })
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					done();
				});
		});

		test('Update deleted user should be not found', async () => {
			await agent
				.delete('/users/' + user.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'edit' })
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('User deleted sucessfully!');
				});

			return agent
				.put('/users/' + user.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'edit' })
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
				});
		});
	});

	describe('DELETE /users', () => {
		test('His data should be deleted', async () => {
			await agent
				.delete('/users/' + admin.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'edit' })
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('User deleted sucessfully!');
				});
		});

		test('Any users should be deleted', async () => {
			await agent
				.delete('/users/' + user.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'edit' })
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('User deleted sucessfully!');
				});

			return agent
				.get('/users/' + user.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
				});
		});

		test('Delete wrong userId should be Validation Error', done => {
			agent
				.delete('/users/1234')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'edit' })
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 200 }));
					done();
				});
		});

		test('Delete inexistent userId should be not found', done => {
			agent
				.delete('/users/507f1f77bcf86cd799439011')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'edit' })
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					done();
				});
		});

		test('Soft deleted: after delete user with GET does not return', async () => {
			await agent
				.delete('/users/' + user.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'edit' })
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('User deleted sucessfully!');
				});

			return agent
				.get('/users')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.length).toBe(1);
				});
		});
	});
});

/*
 * User Role
 */
describe('Role: user', () => {
	describe('GET /users', () => {
		test('Get all users should be Forbidden', done => {
			agent
				.get('/users')
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
					done();
				});
		});

		test('Get only his userID should be done', async () => {
			await agent
				.get('/users/' + user.id)
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.expect(200)
				.then(res => {
					const { email, name, lastname } = user;
					expect(res.body).toEqual(expect.objectContaining({ email, name, lastname }));
				});

			return agent
				.get('/users/' + admin.id)
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
				});
		});
	});

	describe('PUT /users', () => {
		test('His own user should be changed', done => {
			agent
				.put('/users/' + user.id)
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.send({ name: 'edit' })
				.expect(200)
				.then(res => {
					const { email, lastname } = user;
					expect(res.body).toEqual(expect.objectContaining({ email, name: 'edit', lastname }));
					done();
				});
		});

		test('Any other user should be Forbidden', done => {
			agent
				.put('/users/' + admin.id)
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.send({ name: 'edit' })
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
					done();
				});
		});
	});

	describe('DELETE /users', () => {
		test('Any users should be Forbidden', done => {
			agent
				.delete('/users/' + user.id)
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
					done();
				});
		});
	});
});
