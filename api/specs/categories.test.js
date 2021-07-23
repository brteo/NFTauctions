const supertest = require('supertest');

const app = require('../app');
const db = require('../db/connect-test');
const User = require('../models/user');
const Category = require('../models/category');
const Tag = require('../models/tag');
const Nft = require('../models/nft');

const { genereteAuthToken } = require('../helpers/auth');

const agent = supertest.agent(app);

const newCategory = {
	name: {
		it: 'File',
		en: 'File'
	}
};

const wrongSchemaCategory = {
	title: 'File'
};

let admin;
let adminToken;
let user;
let userToken;
let category;
let categoryOfNft;

beforeAll(async () => await db.connect());
beforeEach(async () => {
	await db.clear();

	admin = await new User({
		email: 'admin@meblabs.com',
		password: 'testtest',
		account: 'user1234',
		nickname: 'dormiamonellapaglia',
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
		nickname: '100kAlmese',
		name: 'John',
		lastname: 'Doe',
		role: 'user',
		active: 1
	}).save();
	userToken = genereteAuthToken(user).token;

	category = await new Category({
		name: {
			it: 'Immagini',
			en: 'Images'
		}
	}).save();

	await new Tag({
		name: 'tag'
	}).save();

	categoryOfNft = await new Category({
		name: {
			it: 'Audio',
			en: 'Audio'
		}
	}).save();

	await new Nft({
		_id: 1000005,
		title: 'Nft title',
		description: 'Nft description',
		category: {
			id: categoryOfNft.id,
			name: {
				it: 'Immagini',
				en: 'Images'
			}
		},
		tags: ['tag'],
		url: 'path/to/image',
		author: admin.id,
		owner: admin.id
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
					expect(res.body.length).toBe(2);
					done();
				});
		});

		test('Get any specific categoryId should be done with public fields', done => {
			agent
				.get('/categories/' + category.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					const { _id } = res.body;
					expect(res.body).toEqual(expect.objectContaining({ _id }));
					done();
				});
		});

		test('Get wrong categoryId should be accepted', done => {
			agent
				.get('/categories/1234')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 200 }));
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
				.send({ name: { it: 'Categoria aggiornata' } })
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ name: { it: 'Categoria aggiornata' } }));
					done();
				});
		});

		test('Update wrong categoryId should be not updated', done => {
			agent
				.put('/categories/1234')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: { it: 'Categoria aggiornata' } })
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 200 }));
					done();
				});
		});

		test('Update should be done in every nft that contains category', async () => {
			await agent
				.put('/categories/' + categoryOfNft.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: { it: 'category changed' } })
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ name: { it: 'category changed' } }));
				});

			return agent
				.get('/nfts')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					expect(res.body[0]).toEqual(
						expect.objectContaining({ category: { id: categoryOfNft.id, name: { it: 'category changed' } } })
					);
				});
		});

		test('Update with wrong data should not be done', done => {
			agent
				.put('/categories/' + category.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ title: 'Categoria aggiornata' })
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 201, data: 'name' }));
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
				.send({ name: { it: 'Categoria aggiornata' } })
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
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Category deleted sucessfully!');
				});
		});

		test('Delete should not be done if category exist in a nft', done => {
			agent
				.delete('/categories/' + categoryOfNft.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(406)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 406 }));
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
					expect(res.body.length).toBe(2);
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
				.send({ name: { it: 'category changed' } })
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
