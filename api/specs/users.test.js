const supertest = require('supertest');

const app = require('../app');
const db = require('../db/connect-test');
const User = require('../models/user');
const { genereteAuthToken } = require('../helpers/auth');

const agent = supertest.agent(app);

let admin;
let adminToken;
let user;

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
		pic: 'pic.jpg',
		role: 'user',
		lang: 'it',
		active: 1
	}).save();
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

		test('Get any specific userId should be done with correct cp fields', done => {
			agent
				.get('/users/' + user.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					expect(res.body).toMatchObject({ ...user.response('cp'), _id: user.id });
					done();
				});
		});

		test('Get wrong userId should be ValidationError', done => {
			agent
				.get('/users/1234')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 200 }));
					done();
				});
		});

		test('Get inexistent userId should be NotFound', done => {
			agent
				.get('/users/507f1f77bcf86cd799439011')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					done();
				});
		});

		test('Get deleted user should be NotFound', async () => {
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
				.send({ nickname: 'edit' })
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ nickname: 'edit' }));
					done();
				});
		});

		test('Any users should be changed', done => {
			agent
				.put('/users/' + user.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ nickname: 'edit' })
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ nickname: 'edit' }));
					done();
				});
		});

		test('Update wrong userId should be ValidationError', done => {
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

		test('Update inexistent userId should be NotFound', done => {
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

		test('Update deleted user should be NotFound', async () => {
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

		test('Update with invalid email should be ValidationError', done => {
			agent
				.put('/users/1234')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ email: 'wrong' })
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 210, data: '/email' }));
					done();
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

		test('Delete wrong userId should be ValidationError', done => {
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

		test('Delete inexistent userId should be NotFound', done => {
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

describe('GET /users/[ID]/pic', () => {
	test('Get pic from user id should be redirect to image', done => {
		agent
			.get('/users/' + user.id + '/pic')
			.expect(200)
			.then(res => {
				expect(res.body).toEqual(user.pic);
				done();
			});
	});

	test('Get pic from invalid user id should be NotFound', done => {
		agent
			.get('/users/507f1f77bcf86cd799439011/pic')
			.expect(404)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
				done();
			});
	});

	test('Get pic from user whitout pic be NotFound', done => {
		agent
			.get('/users/' + admin.id + '/pic')
			.expect(404)
			.then(res => {
				expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
				done();
			});
	});
});
