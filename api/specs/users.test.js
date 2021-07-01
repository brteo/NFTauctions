const supertest = require('supertest');

const app = require('../app');
const db = require('../db/connect-test');
const User = require('../models/user');
const { genereteAuthToken } = require('../helpers/auth');

const agent = supertest.agent(app);

const newUser = {
	email: 'matteo@meblabs.com',
	password: 'testtest',
	name: 'Matteo',
	lastname: 'Brocca'
};

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
		name: 'Super',
		lastname: 'Admin',
		role: 'admin',
		active: 1
	}).save();
	adminToken = genereteAuthToken(admin);

	user = await new User({
		email: 'user@meblabs.com',
		password: 'testtest',
		name: 'John',
		lastname: 'Doe',
		role: 'user',
		active: 1
	}).save();
	userToken = genereteAuthToken(user);
});
afterAll(async () => await db.close());

/*
 * Admin Role
 */
describe('Role: admin', () => {
	describe('GET /users', () => {
		test('Get all and should contains two users', done => {
			agent
				.get('/users')
				.set('Authorization', 'bearer ' + adminToken)
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.arrayContaining([]));
					done();
				});
		});

		test('Get any specific userId should done', done => {
			agent
				.get('/users/' + user.id)
				.set('Authorization', 'bearer ' + adminToken)
				.expect(200)
				.then(res => {
					const { email, name, lastname } = user;
					expect(res.body).toEqual(expect.objectContaining({ email, name, lastname }));
					done();
				});
		});

		test('Get wrong userId should be not found', done => {
			agent
				.get('/users/1234')
				.set('Authorization', 'bearer ' + adminToken)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					done();
				});
		});
	});

	describe('POST /users', () => {
		test('A new user should be added', done => {
			agent
				.post('/users')
				.set('Authorization', 'bearer ' + adminToken)
				.send(newUser)
				.expect(201)
				.then(res => {
					const { email, name, lastname } = newUser;
					expect(res.body).toEqual(expect.objectContaining({ email, name, lastname }));
					done();
				});
		});
	});

	describe('PUT /users', () => {
		test('His data should be changed', done => {
			agent
				.put('/users/' + admin.id)
				.set('Authorization', 'bearer ' + adminToken)
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
				.set('Authorization', 'bearer ' + adminToken)
				.send({ name: 'edit' })
				.expect(200)
				.then(res => {
					const { email, lastname } = user;
					expect(res.body).toEqual(expect.objectContaining({ email, name: 'edit', lastname }));
					done();
				});
		});

		test('Change wrong userId should be not found', done => {
			agent
				.put('/users/1234')
				.set('Authorization', 'bearer ' + adminToken)
				.send({ name: 'edit' })
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					done();
				});
		});
	});

	describe('DELETE /users', () => {
		test('His data should be deleted', async () => {
			await agent
				.delete('/users/' + admin.id)
				.set('Authorization', 'bearer ' + adminToken)
				.send({ name: 'edit' })
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('User deleted sucessfully!');
				});

			return agent
				.get('/users/' + admin.id)
				.set('Authorization', 'bearer ' + adminToken)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
				});
		});

		test('Any users should be deleted', async () => {
			await agent
				.delete('/users/' + admin.id)
				.set('Authorization', 'bearer ' + adminToken)
				.send({ name: 'edit' })
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('User deleted sucessfully!');
				});

			return agent
				.get('/users/' + admin.id)
				.set('Authorization', 'bearer ' + adminToken)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
				});
		});

		test('Delete wrong userId should be not found', done => {
			agent
				.delete('/users/1234')
				.set('Authorization', 'bearer ' + adminToken)
				.send({ name: 'edit' })
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					done();
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
				.set('Authorization', 'bearer ' + userToken)
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
					done();
				});
		});

		test('Get only his userID should done', async () => {
			await agent
				.get('/users/' + user.id)
				.set('Authorization', 'bearer ' + userToken)
				.expect(200)
				.then(res => {
					const { email, name, lastname } = user;
					expect(res.body).toEqual(expect.objectContaining({ email, name, lastname }));
				});

			return agent
				.get('/users/' + admin.id)
				.set('Authorization', 'bearer ' + userToken)
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
				});
		});
	});

	describe('POST /users', () => {
		test('Add new should be Forbidden', done => {
			agent
				.post('/users')
				.set('Authorization', 'bearer ' + userToken)
				.send(newUser)
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
					done();
				});
		});
	});

	describe('PUT /users', () => {
		test('His own user should be changed', done => {
			agent
				.put('/users/' + user.id)
				.set('Authorization', 'bearer ' + userToken)
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
				.set('Authorization', 'bearer ' + userToken)
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
				.set('Authorization', 'bearer ' + userToken)
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
					done();
				});
		});
	});
});
