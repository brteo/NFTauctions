const supertest = require('supertest');

const app = require('../app');
const db = require('../db/connect-test');
const User = require('../models/user');
const Auction = require('../models/auction');
const Category = require('../models/category');
const Tag = require('../models/tag');

const { genereteAuthToken } = require('../helpers/auth');

const agent = supertest.agent(app);

const newAuction = {
	title: 'Auction title',
	description: 'Auction description',
	category: {
		name: 'newCategory'
	},
	tags: [
		{
			name: 'newTag'
		}
	],
	image: 'path/to/image'
};

const wrongSchemaAuction = {
	name: 'name'
};

let admin;
let adminToken;
let user;
let userToken;
let auction;

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

	auction = await new Auction({
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
		image: 'path/to/image',
		owner: admin.id
	}).save();
});
afterAll(async () => await db.close());

/*
 * Admin Role
 */
describe('Role: admin', () => {
	describe('GET /auctions', () => {
		test('Get all and should contains an auction', done => {
			agent
				.get('/auctions')
				.set('Authorization', 'bearer ' + adminToken)
				.expect(200)
				.then(res => {
					expect(res.body.length).toBe(1);
					done();
				});
		});

		test('Get any specific auctionId', done => {
			agent
				.get('/auctions/' + auction.id)
				.set('Authorization', 'bearer ' + adminToken)
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ title: 'Auction title' }));
					done();
				});
		});

		test('Get wrong auctionId should be not found', done => {
			agent
				.get('/auctions/1234')
				.set('Authorization', 'bearer ' + adminToken)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					done();
				});
		});

		test('Get deleted auction should be not found', async () => {
			await agent
				.delete('/auctions/' + auction.id)
				.set('Authorization', 'bearer ' + adminToken)
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Auction deleted sucessfully!');
				});

			return agent
				.get('/auctions/' + auction.id)
				.set('Authorization', 'bearer ' + adminToken)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
				});
		});
	});

	describe('POST /auctions', () => {
		test('A new auction should be added', done => {
			agent
				.post('/auctions')
				.set('Authorization', 'bearer ' + adminToken)
				.send(newAuction)
				.expect(201)
				.then(res => {
					const { category, tags } = res.body;
					const { title, description, image } = newAuction;
					expect(res.body).toEqual(expect.objectContaining({ title, description, category, tags, image }));
					done();
				});
		});

		test('A wrong auction should not be added', done => {
			agent
				.post('/auctions')
				.set('Authorization', 'bearer ' + adminToken)
				.send(wrongSchemaAuction)
				.expect(406)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 406 }));
					done();
				});
		});

		test('An auction with inexistent category should not be added', done => {
			newAuction.category.name = 'category inexistent';
			agent
				.post('/auctions')
				.set('Authorization', 'bearer ' + adminToken)
				.send(newAuction)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					expect(res.body.message).toBe('Category not found');
					done();
				});
			newAuction.category.name = 'newCategory';
		});

		test('An auction with inexistent tag should not be added', done => {
			newAuction.tags[0].name = 'tag inexistent';
			agent
				.post('/auctions')
				.set('Authorization', 'bearer ' + adminToken)
				.send(newAuction)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					expect(res.body.message).toBe('Tag not found');
					done();
				});
			newAuction.tags[0].name = 'newTag';
		});
	});

	describe('PATCH /auctions', () => {
		test('Auction data should be changed', done => {
			agent
				.patch('/auctions/' + auction.id)
				.set('Authorization', 'bearer ' + adminToken)
				.send({ title: 'Title changed' })
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ title: 'Title changed' }));
					done();
				});
		});

		test('Update with wrong data should not be done', done => {
			agent
				.patch('/auctions/' + auction.id)
				.set('Authorization', 'bearer ' + adminToken)
				.send({ name: 'Auction changed' })
				.expect(406)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 406 }));
					done();
				});
		});

		test('Update wrong auctionId should be not found', done => {
			agent
				.patch('/auctions/1234')
				.set('Authorization', 'bearer ' + adminToken)
				.send({ title: 'Title changed' })
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					done();
				});
		});

		test('Update deleted auction should be not found', async () => {
			await agent
				.delete('/auctions/' + auction.id)
				.set('Authorization', 'bearer ' + adminToken)
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Auction deleted sucessfully!');
				});

			return agent
				.put('/auctions/' + auction.id)
				.set('Authorization', 'bearer ' + adminToken)
				.send({ title: 'Title changed' })
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
				});
		});
	});

	describe('DELETE /auctions', () => {
		test('Auction data should be deleted', async () => {
			await agent
				.delete('/auctions/' + auction.id)
				.set('Authorization', 'bearer ' + adminToken)
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Auction deleted sucessfully!');
				});
		});

		test('Any auctions should be deleted', async () => {
			await agent
				.delete('/auctions/' + auction.id)
				.set('Authorization', 'bearer ' + adminToken)
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Auction deleted sucessfully!');
				});

			return agent
				.get('/auctions/' + auction.id)
				.set('Authorization', 'bearer ' + adminToken)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
				});
		});

		test('Soft deleted: after delete auction with GET does not return', async () => {
			await agent
				.delete('/auctions/' + auction.id)
				.set('Authorization', 'bearer ' + adminToken)
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Auction deleted sucessfully!');
				});

			return agent
				.get('/auctions')
				.set('Authorization', 'bearer ' + adminToken)
				.expect(200)
				.then(res => {
					expect(res.body.length).toBe(0);
				});
		});
	});
});

/*
 * User Role
 */

describe('Role: user', () => {
	describe('GET /auctions', () => {
		test('Get all auctions should be Permitted', done => {
			agent
				.get('/auctions')
				.set('Authorization', 'bearer ' + userToken)
				.expect(200)
				.then(res => {
					expect(res.body.length).toBe(1);
					done();
				});
		});

		test('Get a auctionId should be done', done => {
			agent
				.get('/auctions/' + auction.id)
				.set('Authorization', 'bearer ' + userToken)
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ title: 'Auction title' }));
					done();
				});
		});
	});

	describe('POST /auctions', () => {
		test('Add new auction should be Permitted', done => {
			agent
				.post('/auctions')
				.set('Authorization', 'bearer ' + userToken)
				.send(newAuction)
				.expect(201)
				.then(res => {
					const { category, tags } = res.body;
					const { title, description, image } = newAuction;
					expect(res.body).toEqual(expect.objectContaining({ title, description, category, tags, image }));
					done();
				});
		});
	});

	describe('PATCH /auctions', () => {
		test('Update your own should be Permitted', async () => {
			let id;
			await agent
				.post('/auctions')
				.set('Authorization', 'bearer ' + userToken)
				.send(newAuction)
				.expect(201)
				.then(res => {
					const { _id, category, tags } = res.body;
					id = _id;
					const { title, description, image } = newAuction;
					expect(res.body).toEqual(expect.objectContaining({ title, description, category, tags, image }));
				});

			return agent
				.patch('/auctions/' + id)
				.set('Authorization', 'bearer ' + userToken)
				.send({ title: 'Title changed' })
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ title: 'Title changed' }));
				});
		});

		test('Update auctions of others users should be Forbidden', done => {
			agent
				.patch('/auctions/' + auction.id)
				.set('Authorization', 'bearer ' + userToken)
				.send({ title: 'Title changed' })
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
					done();
				});
		});
	});

	describe('DELETE /auctions', () => {
		test('Delete your own should be Permitted', async () => {
			let id;
			await agent
				.post('/auctions')
				.set('Authorization', 'bearer ' + userToken)
				.send(newAuction)
				.expect(201)
				.then(res => {
					const { _id, category, tags } = res.body;
					id = _id;
					const { title, description, image } = newAuction;
					expect(res.body).toEqual(expect.objectContaining({ title, description, category, tags, image }));
				});

			return agent
				.delete('/auctions/' + id)
				.set('Authorization', 'bearer ' + userToken)
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Auction deleted sucessfully!');
				});
		});

		test('Delete auctions of others users should be Forbidden', done => {
			agent
				.delete('/auctions/' + auction.id)
				.set('Authorization', 'bearer ' + userToken)
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
					done();
				});
		});
	});
});
