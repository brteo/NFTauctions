const supertest = require('supertest');

const app = require('../app');
const db = require('../db/connect-test');
const User = require('../models/user');
const Category = require('../models/category');
const Tag = require('../models/tag');

const { genereteAuthToken } = require('../helpers/auth');

const agent = supertest.agent(app);

const newCategory = {
	name: 'Image'
};

const wrongSchemaCategory = {
	title: 'File'
};

const newAuction = {
	title: 'Auction title',
	description: 'Auction description',
	category: {
		name: 'category'
	},
	tags: [
		{
			name: 'tag'
		}
	],
	image: 'path/to/image'
};

let admin;
let adminToken;
let user;
let userToken;
let category;

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
	adminToken = genereteAuthToken(admin).token;

	user = await new User({
		email: 'user@meblabs.com',
		password: 'testtest',
		name: 'John',
		lastname: 'Doe',
		role: 'user',
		active: 1
	}).save();
	userToken = genereteAuthToken(user).token;

	category = await new Category({
		name: 'category'
	}).save();

	await new Tag({
		name: 'tag'
	}).save();
});
afterAll(async () => await db.close());

/*
 * Admin Role
 */
describe('Role: admin', () => {
	describe('GET /categories', () => {
		test('Get all should contains a category', done => {
			agent
				.get('/categories')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.length).toBe(1);
					done();
				});
		});

		test('Get any specific categoryId should be done with correct public fields', done => {
			agent
				.get('/categories/' + category.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					const { name } = category;
					expect(res.body).toMatchObject({ name });
					done();
				});
		});

		test('Get wrong categoryId should be not found', done => {
			agent
				.get('/categories/1234')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					done();
				});
		});

		test('Get deleted category should be not found', async () => {
			await agent
				.delete('/categories/' + category.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Category deleted sucessfully!');
				});

			return agent
				.get('/categories/' + category.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
				});
		});
	});

	describe('POST /categories', () => {
		test('A new category should be added', done => {
			agent
				.post('/categories')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send(newCategory)
				.expect(201)
				.then(res => {
					const { name } = newCategory;
					expect(res.body).toEqual(expect.objectContaining({ name }));
					done();
				});
		});

		test('A wrong category should not be added', done => {
			agent
				.post('/categories')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send(wrongSchemaCategory)
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 201 }));
					done();
				});
		});

		test('A empty category should not be added', done => {
			agent
				.post('/categories')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 201 }));
					done();
				});
		});
	});

	describe('PUT /categories', () => {
		test('Category data should be changed', done => {
			agent
				.put('/categories/' + category.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'category changed' })
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ name: 'category changed' }));
					done();
				});
		});

		test('Update wrong categoryId should be not found', done => {
			agent
				.put('/categories/1234')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'category changed' })
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					done();
				});
		});

		test('Update should be done in every auction that contains category', async () => {
			await agent.post('/auctions').set('Cookie', `TvgAccessToken=${adminToken}`).send(newAuction).expect(201);

			await agent
				.put('/categories/' + category.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'category changed' })
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ name: 'category changed' }));
				});

			return agent
				.get('/auctions')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					expect(res.body[0]).toEqual(expect.objectContaining({ category: { name: 'category changed' } }));
				});
		});

		test('Update with wrong data should not be done', done => {
			agent
				.put('/categories/' + category.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ title: 'category changed' })
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 201 }));
					done();
				});
		});

		test('Update deleted category should be not found', async () => {
			await agent
				.delete('/categories/' + category.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Category deleted sucessfully!');
				});

			return agent
				.put('/categories/' + category.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'category changed' })
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
				});
		});
	});

	describe('DELETE /categories', () => {
		test('Category data should be deleted', async () => {
			await agent
				.delete('/categories/' + category.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'category changed' })
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Category deleted sucessfully!');
				});
		});

		test('Delete should not be done if category exist in an auction', async () => {
			await agent.post('/auctions').set('Cookie', `TvgAccessToken=${adminToken}`).send(newAuction).expect(201);

			return agent
				.delete('/categories/' + category.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 100 }));
				});
		});

		test('Category data should be changed', done => {
			agent
				.put('/categories/' + category.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'category changed' })
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ name: 'category changed' }));
					done();
				});
		});

		test('Delete category userId should be not found', done => {
			agent
				.delete('/categories/1234')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
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
	describe('GET /categories', () => {
		test('Get all categories should be permitted', done => {
			agent
				.get('/categories')
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.length).toBe(1);
					done();
				});
		});
	});

	describe('POST /categories', () => {
		test('Add new category should be Forbidden', done => {
			agent
				.post('/categories')
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.send(newCategory)
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
					done();
				});
		});
	});

	describe('PUT /categories', () => {
		test('category edit should be Forbidden', done => {
			agent
				.put('/categories/' + category.id)
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.send({ name: 'category changed' })
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
					done();
				});
		});
	});

	describe('DELETE /categories', () => {
		test('Category delete should be Forbidden', done => {
			agent
				.delete('/categories/' + category.id)
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
					done();
				});
		});
	});
});
