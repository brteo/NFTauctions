const supertest = require('supertest');

const app = require('../app');
const db = require('../db/connect-test');
const User = require('../models/user');
const Auction = require('../models/auction');
const Category = require('../models/category');
const Tag = require('../models/tag');
const Nft = require('../models/nft');
const Bet = require('../models/bet');

const { genereteAuthToken } = require('../helpers/auth');

const agent = supertest.agent(app);

const newAuction = {
	description: 'newDescription',
	basePrice: 100,
	deadline: '2029-07-02 00:00:00'
};

const wrongSchemaAuction = {
	name: 'name'
};

let admin;
let adminToken;
let user;
let userToken;
let auction;
let nft;
let categoryInNft;

beforeAll(async () => await db.connect());
beforeEach(async () => {
	await db.clear();

	admin = await new User({
		email: 'admin@meblabs.com',
		password: 'testtest',
		account: 'user1234',
		nickname: 'paperino',
		name: 'Super',
		lastname: 'Admin',
		role: 'admin',
		active: 1
	}).save();
	adminToken = genereteAuthToken(admin).token;

	user = await new User({
		email: 'user1@meblabs.com',
		password: 'testtest',
		account: 'user4321',
		nickname: 'pluto',
		name: 'John',
		lastname: 'Doe',
		role: 'user',
		pic: 'user1-pic.jpg',
		active: 1
	}).save();
	userToken = genereteAuthToken(user).token;

	categoryInNft = await new Category({
		name: {
			it: 'Immagini',
			en: 'Images'
		}
	}).save();

	await new Tag({
		name: 'tag'
	}).save();

	await Category({
		name: {
			it: 'File',
			en: 'File'
		}
	}).save();

	await Tag({
		name: 'newTag'
	}).save();

	nft = await new Nft({
		_id: 2000001,
		title: 'Nft title',
		description: 'Nft description',
		category: {
			id: categoryInNft.id,
			name: {
				it: 'Immagini',
				en: 'Images'
			}
		},
		tags: ['tag'],
		url: 'path/to/url',
		author: admin.id,
		owner: admin.id
	}).save();

	auction = await new Auction({
		description: 'Description',
		basePrice: 100,
		price: 100,
		deadline: '2029-07-02 00:00:00',
		nft: nft.id,
		active: 1
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
				.expect(200)
				.then(res => {
					expect(res.body.length).toBe(1);
					done();
				});
		});

		test('Get any specific auctionId', done => {
			agent
				.get('/auctions/' + auction.id)
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ basePrice: 100 }));
					done();
				});
		});

		test('Get with wrong auctionId should not be done', done => {
			agent
				.get('/auctions/1234')
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 200 }));
					done();
				});
		});

		test('Get deleted auction should not be found', async () => {
			await agent
				.delete('/auctions/' + auction.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Auction deleted sucessfully!');
				});

			return agent
				.get('/auctions/' + auction.id)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
				});
		});
	});

	describe('POST /auctions', () => {
		test('A new auction should be added', async () => {
			const newNft = await new Nft({
				_id: 2000002,
				title: 'Nft title',
				description: 'Nft description',
				category: {
					id: categoryInNft.id,
					name: {
						it: 'Immagini',
						en: 'Images'
					}
				},
				tags: ['tag'],
				url: 'path/to/url',
				author: admin.id,
				owner: admin.id
			}).save();

			newAuction.nft = Number(newNft.id);

			return agent
				.post('/auctions')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send(newAuction)
				.expect(201)
				.then(res => {
					const { basePrice, description, deadline } = res.body;
					expect(res.body).toEqual(expect.objectContaining({ basePrice, description, deadline }));
				});
		});

		test('A wrong auction should not be added', done => {
			agent
				.post('/auctions')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send(wrongSchemaAuction)
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 202, data: '/name' }));
					done();
				});
		});

		test('An auction with inexistent nft should not be added', done => {
			newAuction.nft = 123456789;

			agent
				.post('/auctions')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send(newAuction)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					expect(res.body.message).toBe('Nft not found');
					done();
				});
		});
	});

	describe('PATCH /auctions', () => {
		test('Auction data should be changed', done => {
			agent
				.patch('/auctions/' + auction.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ description: 'Description changed' })
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ description: 'Description changed' }));
					done();
				});
		});

		test('Update with wrong data should not be done', done => {
			agent
				.patch('/auctions/' + auction.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ name: 'Auction changed' })
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 202, data: '/name' }));
					done();
				});
		});

		test('Update with wrong auctionId should not be done', done => {
			agent
				.patch('/auctions/1234')
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.send({ description: 'Description changed' })
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 200 }));
					done();
				});
		});

		test('Update deleted auction should not be found', async () => {
			await agent
				.delete('/auctions/' + auction.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Auction deleted sucessfully!');
				});

			return agent
				.put('/auctions/' + auction.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
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
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Auction deleted sucessfully!');
				});
		});

		test('Any auctions should be deleted', async () => {
			await agent
				.delete('/auctions/' + auction.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Auction deleted sucessfully!');
				});

			return agent
				.get('/auctions/' + auction.id)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
				});
		});

		test('Soft deleted: after delete auction with GET does not return', async () => {
			await agent
				.delete('/auctions/' + auction.id)
				.set('Cookie', `TvgAccessToken=${adminToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Auction deleted sucessfully!');
				});

			return agent
				.get('/auctions')
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
				.expect(200)
				.then(res => {
					expect(res.body.length).toBe(1);
					done();
				});
		});

		test('Get a auctionId should be done', done => {
			agent
				.get('/auctions/' + auction.id)
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ description: 'Description' }));
					done();
				});
		});
	});

	describe('POST /auctions', () => {
		test('Add new auction should be Permitted', async () => {
			const newNft = await new Nft({
				_id: 2000002,
				title: 'Nft title',
				description: 'Nft description',
				category: {
					id: categoryInNft.id,
					name: {
						it: 'Immagini',
						en: 'Images'
					}
				},
				tags: ['tag'],
				url: 'path/to/url',
				author: admin.id,
				owner: admin.id
			}).save();

			newAuction.nft = Number(newNft.id);

			return agent
				.post('/auctions')
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.send(newAuction)
				.expect(201)
				.then(res => {
					const { basePrice, description, deadline } = res.body;
					expect(res.body).toEqual(expect.objectContaining({ basePrice, description, deadline }));
				});
		});
	});

	describe('PATCH /auctions', () => {
		test('Update your own should be Permitted', async () => {
			const newNft = await new Nft({
				_id: 3000001,
				title: 'Nft title',
				description: 'Nft description',
				category: {
					id: categoryInNft.id,
					name: {
						it: 'categoria',
						en: 'category'
					}
				},
				tags: ['tag'],
				url: 'path/to/url',
				author: user.id,
				owner: user.id
			}).save();

			let id;
			newAuction.nft = Number(newNft.id);
			await agent
				.post('/auctions')
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.send(newAuction)
				.expect(201)
				.then(res => {
					const { _id, basePrice, description, deadline } = res.body;
					id = _id;
					expect(res.body).toEqual(expect.objectContaining({ basePrice, description, deadline }));
				});

			return agent
				.patch('/auctions/' + id)
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.send({ description: 'Description changed' })
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ description: 'Description changed' }));
				});
		});

		test('Update auctions of others users should be Forbidden', done => {
			agent
				.patch('/auctions/' + auction.id)
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.send({ description: 'Description changed' })
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
					done();
				});
		});
	});

	describe('DELETE /auctions', () => {
		test('Delete your own should be Permitted', async () => {
			const newNft = await new Nft({
				_id: 3000001,
				title: 'Nft title',
				description: 'Nft description',
				category: {
					id: categoryInNft.id,
					name: {
						it: 'categoria',
						en: 'category'
					}
				},
				tags: ['tag'],
				url: 'path/to/url',
				author: user.id,
				owner: user.id
			}).save();

			let id;
			newAuction.nft = Number(newNft.id);
			await agent
				.post('/auctions')
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.send(newAuction)
				.expect(201)
				.then(res => {
					const { _id, basePrice, description, deadline } = res.body;
					id = _id;
					expect(res.body).toEqual(expect.objectContaining({ basePrice, description, deadline }));
				});

			return agent
				.delete('/auctions/' + id)
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.message).toBe('Auction deleted sucessfully!');
				});
		});

		test('Delete auctions of others users should be Forbidden', done => {
			agent
				.delete('/auctions/' + auction.id)
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
					done();
				});
		});
	});
});

describe('Bets', () => {
	describe('GET /auctions/:id/bets', () => {
		test('Get auction bets should be empty', async () =>
			agent
				.get('/auctions/' + auction.id + '/bets')
				.expect(200)
				.then(res => {
					expect(res.body).toEqual([]);
				}));

		test.todo('Get auction bets should be 2');
		test.todo('Get last 10 auction bets');

		test.todo('Get auction bets');
	});
	describe('PUT /auctions/:id/bets', () => {
		test.todo('Add a new bet should be ok');
		test.todo('Add a new bet without auth should be Unauthorized');
		test.todo('Add a new bet without price should be a ValidationError');
	});
});
