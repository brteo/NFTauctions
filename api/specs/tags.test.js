const supertest = require('supertest');

const app = require('../app');
const db = require('../db/connect-test');
const User = require('../models/user');
const Tag = require('../models/tag');
const Category = require('../models/category');
const Nft = require('../models/nft');

const { genereteAuthToken } = require('../helpers/auth');

const agent = supertest.agent(app);

const newTag = {
	name: 'IMAGE'
};

const wrongSchemaTag = {
	title: 'FILE'
};

let admin;
let adminToken;
let user;
let userToken;
let tag;
let tagOfNft;

beforeAll(async () => await db.connect());
beforeEach(async () => {
	await db.clear();

	admin = await new User({
		email: 'admin@meblabs.com',
		password: 'testtest',
		account: 'user1234',
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
		name: 'John',
		lastname: 'Doe',
		role: 'user',
		active: 1
	}).save();
	userToken = genereteAuthToken(user).token;

	tag = await new Tag({
		name: 'tag'
	}).save();

	tagOfNft = await new Tag({
		name: 'tag2'
	}).save();

	const category = await new Category({
		name: {
			it: 'Immagini',
			en: 'Images'
		}
	}).save();

	await new Nft({
		_id: 1000005,
		title: 'Nft title',
		description: 'Nft description',
		category: {
			id: category.id,
			name: {
				it: 'Immagini',
				en: 'Images'
			}
		},
		tags: ['tag2'],
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
	describe('GET /tags', () => {
		test('Get all should contains a tag', done => {
			agent
				.get('/tags')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.length).toBe(2);
					done();
				});
		});

		test('Get any specific tagId should be done with correct public fields', done => {
			agent
				.get('/tags/' + tag.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					const { name } = tag;
					expect(res.body).toMatchObject({ name });
					done();
				});
		});

		test('Get wrong tagId should be not done', done => {
			agent
				.get('/tags/1234')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 200 }));
					done();
				});
		});

		test('Get deleted tag should be not found', async () => {
			await agent
				.delete('/tags/' + tag.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Tag deleted sucessfully!');
				});

			return agent
				.get('/tags/' + tag.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
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
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send(newTag)
				.expect(201)
				.then(res => {
					const { name } = newTag;
					expect(res.body).toEqual(expect.objectContaining({ name }));
					done();
				});
		});

		test('A wrong tag should not be added', done => {
			agent
				.post('/tags')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send(wrongSchemaTag)
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 201, data: 'name' }));
					done();
				});
		});
	});

	describe('PUT /tags', () => {
		test('Tag data should be changed', done => {
			agent
				.put('/tags/' + tag.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'tag changed' })
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ name: 'tag changed' }));
					done();
				});
		});

		test('Update with wrong tagId should be not done', done => {
			agent
				.put('/tags/1234')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'tag changed' })
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 200 }));
					done();
				});
		});

		test('Update should be done in every nft that contains tag', async () => {
			await agent
				.put('/tags/' + tag.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'tag changed' })
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ name: 'tag changed' }));
				});

			return agent
				.get('/nfts')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					const { tags } = res.body[0];
					expect(res.body[0]).toEqual(expect.objectContaining({ tags }));
				});
		});

		test('Update with wrong data should not be done', done => {
			agent
				.put('/tags/' + tag.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ title: 'tag changed' })
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 201, data: 'name' }));
					done();
				});
		});

		test('Update deleted tag should be not found', async () => {
			await agent
				.delete('/tags/' + tag.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Tag deleted sucessfully!');
				});

			return agent
				.put('/tags/' + tag.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
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
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'tag changed' })
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Tag deleted sucessfully!');
				});
		});

		test('Delete should not be done if tag exist in a nft', done => {
			agent
				.delete('/tags/' + tagOfNft.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(406)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 406 }));
					done();
				});
		});

		test('Delete tag with wrong tagId should be not done', done => {
			agent
				.delete('/tags/1234')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 200 }));
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
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.length).toBe(2);
					done();
				});
		});
	});

	describe('POST /tags', () => {
		test('Add new tag should be Forbidden', done => {
			agent
				.post('/tags')
				.set('Cookie', `TvgAccessToken=${userToken}`)
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
				.set('Cookie', `TvgAccessToken=${userToken}`)
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
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
					done();
				});
		});
	});
});
