const supertest = require('supertest');

const app = require('../app');
const db = require('../db/connect-test');

const agent = supertest.agent(app);

beforeAll(async () => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async () => await db.close());

const auction = {
	title: 'File Txt',
	description: 'A file txt',
	category: '60dcafc1ec866b4ce2e15a13',
	tags: ['60dcafc19fb861e45782fb23'],
	image: 'image'
};

describe('POST /auctions', () => {
	test('New auction should be added', done => {
		agent
			.post('/auctions')
			.send(auction)
			.expect(201)
			.then(res => {
				expect(res.body._id).toBeTruthy();
				done();
			});
	});
});

describe('GET /auctions', () => {
	test('collection should be empty', done => {
		agent
			.get('/auctions')
			.expect(200)
			.then(res => {
				expect(res.body).toEqual(expect.arrayContaining([]));
				done();
			});
	});

	test('add a tag and get it', async () => {
		await agent
			.post('/auctions')
			.send(auction)
			.expect(201)
			.then(res => {
				expect(res.body).toBeTruthy();
			});

		return agent
			.get('/auctions')
			.expect(200)
			.then(res => {
				expect(res.body).toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							title: auction.title
						})
					])
				);
			});
	});
});
