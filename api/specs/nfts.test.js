const supertest = require('supertest');

const app = require('../app');
const db = require('../db/connect-test');
const User = require('../models/user');
const Nft = require('../models/nft');
const Category = require('../models/category');
const Tag = require('../models/tag');

const { genereteAuthToken } = require('../helpers/auth');

const agent = supertest.agent(app);

const newNft = {
	title: 'Nft title',
	description: 'Nft description',
	category: {
		name: 'newCategory'
	},
	tags: [
		{
			name: 'newTag'
		}
	],
	url: 'path/to/image'
};

const wrongSchemaNft = {
	name: 'name'
};

let admin;
let adminToken;
let user;
let userToken;
let nft;
let soldNft;

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

	await new Category({
		name: 'category'
	}).save();

	await new Tag({
		name: 'tag'
	}).save();

	await Category({
		name: 'newCategory'
	}).save();

	await Tag({
		name: 'newTag'
	}).save();

	nft = await new Nft({
		title: 'Nft title',
		description: 'Nft description',
		category: {
			name: 'category'
		},
		tags: [
			{
				name: 'tag'
			}
		],
		url: 'path/to/image',
		author: admin.id,
		owner: admin.id
	}).save();

	soldNft = await new Nft({
		title: 'Nft 2 title',
		description: 'Nft 2 description',
		category: {
			name: 'category'
		},
		tags: [
			{
				name: 'tag'
			}
		],
		url: 'path/to/image',
		author: admin.id,
		owner: user.id
	}).save();
});
afterAll(async () => await db.close());

/*
 * Admin Role
 */
describe('Role: admin', () => {
	describe('GET /nfts', () => {
		test('Get all', done => {
			agent
				.get('/nfts')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.length).toBe(2);
					done();
				});
		});

		test('Get Nft by Id', done => {
			agent
				.get('/nfts/' + nft.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ title: 'Nft title' }));
					done();
				});
		});

		test('Get wrong NftId should not be found', done => {
			agent
				.get('/nfts/123456789000')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					done();
				});
		});

		test('Get deleted nft should not be found', async () => {
			await agent
				.delete('/nfts/' + nft.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Nft deleted sucessfully!');
				});

			return agent
				.get('/nfts/' + nft.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
				});
		});
	});

	describe('POST /nfts', () => {
		test('A new nft should be added', done => {
			agent
				.post('/nfts')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send(newNft)
				.expect(201)
				.then(res => {
					const { category, tags } = res.body;
					const { title, description, url } = newNft;
					expect(res.body).toEqual(expect.objectContaining({ title, description, category, tags, url }));
					done();
				});
		});

		test('A wrong nft should not be added', done => {
			agent
				.post('/nfts')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send(wrongSchemaNft)
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 202, data: 'name' }));
					done();
				});
		});

		test('An nft with inexistent category should not be added', done => {
			newNft.category.name = 'category inexistent';
			agent
				.post('/nfts')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send(newNft)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					expect(res.body.message).toBe('Category not found');
					done();
				});
			newNft.category.name = 'newCategory';
		});

		test('An nft with inexistent tag should not be added', done => {
			newNft.tags[0].name = 'tag inexistent';
			agent
				.post('/nfts')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send(newNft)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					expect(res.body.message).toBe('Tag not found');
					done();
				});
			newNft.tags[0].name = 'newTag';
		});
	});

	describe('PATCH /nfts', () => {
		test('Nft data should be changed', done => {
			agent
				.patch('/nfts/' + nft.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ title: 'Title changed' })
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ title: 'Title changed' }));
					done();
				});
		});

		test('Update with wrong data should not be done', done => {
			agent
				.patch('/nfts/' + nft.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'Nft changed' })
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 202, data: 'name' }));
					done();
				});
		});

		test('Update wrong NftId should be not found', done => {
			agent
				.patch('/nfts/123456789000')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ title: 'Title changed' })
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					done();
				});
		});

		test('Update deleted nft should be not found', async () => {
			await agent
				.delete('/nfts/' + nft.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Nft deleted sucessfully!');
				});

			return agent
				.put('/nfts/' + nft.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ title: 'Title changed' })
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
				});
		});
	});

	describe('DELETE /nfts', () => {
		test('Nft unsold should be deleted', async () => {
			await agent
				.delete('/nfts/' + nft.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Nft deleted sucessfully!');
				});

			await agent
				.get('/nfts/' + nft.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
				});

			return agent
				.get('/nfts')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.length).toBe(1);
				});
		});

		test('Delete sold nfts should be Forbidden', done => {
			agent
				.delete('/nfts/' + soldNft.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
					done();
				});
		});
	});
});

/*
 * User Role
 */

describe('Role: user', () => {
	describe('GET /nfts', () => {
		test('Get all nfts should be Permitted', done => {
			agent
				.get('/nfts')
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.length).toBe(2);
					done();
				});
		});

		test('Get a nftId should be done', done => {
			agent
				.get('/nfts/' + nft.id)
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ title: 'Nft title' }));
					done();
				});
		});
	});

	describe('POST /nfts', () => {
		test('Add new nft should be Permitted', done => {
			agent
				.post('/nfts')
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.send(newNft)
				.expect(201)
				.then(res => {
					const { category, tags } = res.body;
					const { title, description, url } = newNft;
					expect(res.body).toEqual(expect.objectContaining({ title, description, category, tags, url }));
					done();
				});
		});
	});

	describe('PATCH /nfts', () => {
		test('Update your own should be Permitted', async () => {
			let id;
			await agent
				.post('/nfts')
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.send(newNft)
				.expect(201)
				.then(res => {
					const { _id, category, tags } = res.body;
					id = _id;
					const { title, description, url } = newNft;
					expect(res.body).toEqual(expect.objectContaining({ title, description, category, tags, url }));
				});

			return agent
				.patch('/nfts/' + id)
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.send({ title: 'Title changed' })
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ title: 'Title changed' }));
				});
		});

		test('Update nfts of others users should be Forbidden', done => {
			agent
				.patch('/nfts/' + nft.id)
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.send({ title: 'Title changed' })
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
					done();
				});
		});
	});

	describe('DELETE /nfts', () => {
		test('Delete your own should be Permitted', async () => {
			let id;
			await agent
				.post('/nfts')
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.send(newNft)
				.expect(201)
				.then(res => {
					const { _id, category, tags } = res.body;
					id = _id;
					const { title, description, url } = newNft;
					expect(res.body).toEqual(expect.objectContaining({ title, description, category, tags, url }));
				});

			return agent
				.delete('/nfts/' + id)
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Nft deleted sucessfully!');
				});
		});

		test('Delete nfts of others users should be Forbidden', done => {
			agent
				.delete('/nfts/' + nft.id)
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
					done();
				});
		});
	});
});
