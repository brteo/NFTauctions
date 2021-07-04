const supertest = require('supertest');

const app = require('../app');
const db = require('../db/connect-test');
const User = require('../models/user');
const Tag = require('../models/tag');

const { genereteAuthToken } = require('../helpers/auth');

const agent = supertest.agent(app);

const newTag = {
	name: 'IMAGE'
};

let admin;
let adminToken;
let user;
let userToken;
let tag;

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

	tag = await new Tag({
		name: 'tag'
	}).save();
});
afterAll(async () => await db.close());

/*
 * Admin Role
 */
describe('Role: admin', () => {
	describe('GET /tags', () => {
		test('Get all should contains a tag', done => {
			agent
				.get('/tags')
				.set('Authorization', 'bearer ' + adminToken)
				.expect(200)
				.then(res => {
					expect(res.body.length).toBe(1);
					done();
				});
		});

		test('Get any specific tagId should be done with correct public fields', done => {
			agent
				.get('/tags/' + tag.id)
				.set('Authorization', 'bearer ' + adminToken)
				.expect(200)
				.then(res => {
					const { name } = tag;
					expect(res.body).toMatchObject({ name });
					done();
				});
		});

		test('Get wrong tagId should be not found', done => {
			agent
				.get('/tags/1234')
				.set('Authorization', 'bearer ' + adminToken)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					done();
				});
		});

		test('Get deleted tag should be not found', async () => {
			await agent
				.delete('/tags/' + tag.id)
				.set('Authorization', 'bearer ' + adminToken)
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Tag deleted sucessfully!');
				});

			return agent
				.get('/tags/' + tag.id)
				.set('Authorization', 'bearer ' + adminToken)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
				});
		});
	});

	describe('POST /tags', () => {
		test('A new tag should be added', done => {
			agent
				.post('/tags')
				.set('Authorization', 'bearer ' + adminToken)
				.send(newTag)
				.expect(201)
				.then(res => {
					const { name } = newTag;
					expect(res.body).toEqual(expect.objectContaining({ name }));
					done();
				});
		});
	});

	describe('PUT /tags', () => {
		test('Tag data should be changed', done => {
			agent
				.put('/tags/' + tag.id)
				.set('Authorization', 'bearer ' + adminToken)
				.send({ name: 'tag changed' })
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ name: 'tag changed' }));
					done();
				});
		});

		test('Update wrong tagId should be not found', done => {
			agent
				.put('/tags/1234')
				.set('Authorization', 'bearer ' + adminToken)
				.send({ name: 'tag changed' })
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					done();
				});
		});

		test('Update deleted user should be not found', async () => {
			await agent
				.delete('/tags/' + tag.id)
				.set('Authorization', 'bearer ' + adminToken)
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Tag deleted sucessfully!');
				});

			return agent
				.put('/tags/' + tag.id)
				.set('Authorization', 'bearer ' + adminToken)
				.send({ name: 'tag changed' })
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
				});
		});
	});

	describe('DELETE /tags', () => {
		test('Tag data should be deleted', async () => {
			await agent
				.delete('/tags/' + tag.id)
				.set('Authorization', 'bearer ' + adminToken)
				.send({ name: 'tag changed' })
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Tag deleted sucessfully!');
				});
		});

		test('Delete tag userId should be not found', done => {
			agent
				.delete('/tags/1234')
				.set('Authorization', 'bearer ' + adminToken)
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
	describe('GET /tags', () => {
		test('Get all tags should be permitted', done => {
			agent
				.get('/tags')
				.set('Authorization', 'bearer ' + userToken)
				.expect(200)
				.then(res => {
					expect(res.body.length).toBe(1);
					done();
				});
		});
	});

	describe('POST /tags', () => {
		test('Add new tag should be Forbidden', done => {
			agent
				.post('/tags')
				.set('Authorization', 'bearer ' + userToken)
				.send(newTag)
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
					done();
				});
		});
	});

	describe('PUT /tags', () => {
		test('Tag edit should be Forbidden', done => {
			agent
				.put('/tags/' + tag.id)
				.set('Authorization', 'bearer ' + userToken)
				.send({ name: 'tag changed' })
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
					done();
				});
		});
	});

	describe('DELETE /tags', () => {
		test('Tag delete should be Forbidden', done => {
			agent
				.delete('/tags/' + tag.id)
				.set('Authorization', 'bearer ' + userToken)
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
					done();
				});
		});
	});
});
