const supertest = require('supertest');
const mongoose = require('mongoose');

const app = require('../app');
const db = require('../db/connect-test');
const User = require('../models/user');
const Nft = require('../models/nft');
const Category = require('../models/category');
const Tag = require('../models/tag');
const { eos, addKey } = require('../helpers/eosjs');

jest.mock('../helpers/eosjs');

const { genereteAuthToken } = require('../helpers/auth');

const { ObjectId } = mongoose.Types;
const agent = supertest.agent(app);

const newNft = {
	title: 'New nft title',
	description: 'New nft description',
	category: {
		id: '60f6c6ab59fc210d3ba2c165'
	},
	tags: ['newTag'],
	url: 'path/to/image'
};

const wrongSchemaNft = {
	name: 'name'
};

let admin;
let adminToken;
let user1;
let user2;
let userToken;
let nft;
let soldNft;

beforeAll(async () => await db.connect());
beforeEach(async () => {
	await db.clear();

	admin = await new User({
		email: 'admin@meblabs.com',
		password: 'testtest',
		account: 'tvgadmin1',
		name: 'Super',
		lastname: 'Admin',
		role: 'admin',
		active: 1
	}).save();
	adminToken = genereteAuthToken(admin).token;

	user1 = await new User({
		email: 'user1@meblabs.com',
		password: 'testtest',
		account: 'tvguser1',
		name: 'John',
		lastname: 'Doe',
		role: 'user',
		active: 1
	}).save();
	userToken = genereteAuthToken(user1).token;

	user2 = await new User({
		email: 'user2@meblabs.com',
		password: 'testtest',
		account: 'tvguser2',
		name: 'Pinco',
		lastname: 'Pallino',
		role: 'user',
		active: 1
	}).save();
	userToken = genereteAuthToken(user2).token;

	const cat1 = await new Category({
		_id: ObjectId('60f6c5c1897dd8f84a08c36a'),
		name: { it: 'categoria', en: 'category' }
	}).save();

	await new Tag({
		name: 'tag'
	}).save();

	const cat2 = await Category({
		_id: ObjectId('60f6c6ab59fc210d3ba2c165'),
		name: { it: 'new category', en: 'new category' }
	}).save();

	await Tag({
		name: 'newTag'
	}).save();

	nft = await new Nft({
		_id: 1000005,
		title: 'Nft 5 title',
		description: 'Nft 5 description',
		category: {
			id: cat1.id,
			name: cat1.name
		},
		tags: ['tag'],
		url: 'path/to/image',
		author: user1.id,
		owner: user1.id
	}).save();

	soldNft = await new Nft({
		_id: 1000006,
		title: 'Nft 6 title',
		description: 'Nft 6 description',
		category: {
			id: cat1.id,
			name: cat1.name
		},
		tags: ['tag'],
		url: 'path/to/image',
		author: user1.id,
		owner: user2.id
	}).save();
});
afterEach(() => {
	jest.clearAllMocks();
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
					expect(res.body).toEqual(expect.objectContaining({ title: 'Nft 5 title' }));
					done();
				});
		});

		test('Get wrong NftId should be NotFound', done => {
			agent
				.get('/nfts/123456789000')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					done();
				});
		});

		test('Get deleted nft should be NotFound', async () => {
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
		eos.transact.mockResolvedValue({
			processed: {
				action_traces: [{ return_value_data: 1000007 }]
			}
		});

		test('A new nft should be added', async () =>
			agent
				.post('/nfts')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send(newNft)
				.expect(201)
				.then(res => {
					const { category, tags } = res.body;
					const { title, description, url } = newNft;
					expect(res.body).toEqual(expect.objectContaining({ title, description, category, tags, url }));
					expect(eos.transact.mock.calls.length).toBe(1);
				}));

		test('A wrong nft should not be added', done => {
			agent
				.post('/nfts')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send(wrongSchemaNft)
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 202, data: 'name' }));
					expect(eos.transact.mock.calls.length).toBe(0);
					done();
				});
		});

		test('An nft with inexistent category should not be added', done => {
			newNft.category.id = '60f6cefe1f8fd638bd2a6f10';
			agent
				.post('/nfts')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send(newNft)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					expect(res.body.message).toBe('Category not found');
					expect(eos.transact.mock.calls.length).toBe(0);
					done();
				});
			newNft.category.id = '60f6c6ab59fc210d3ba2c165';
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

		test('Update wrong NftId should be NotFound', done => {
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

		test('Update deleted nft should be NotFound', async () => {
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
					expect(res.body).toEqual(expect.objectContaining({ title: 'Nft 5 title' }));
					done();
				});
		});
	});

	describe('POST /nfts', () => {
		eos.transact.mockResolvedValue({
			processed: {
				action_traces: [{ return_value_data: 1000007 }]
			}
		});
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
					expect(eos.transact.mock.calls.length).toBe(1);
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
