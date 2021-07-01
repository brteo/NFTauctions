const supertest = require('supertest');

const app = require('../app');
const db = require('../db/connect-test');

const agent = supertest.agent(app);

beforeAll(async () => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async () => await db.close());

const category = {
	name: 'Image'
};

describe('POST /categories', () => {
	test('New category should be added', done => {
		agent
			.post('/categories')
			.send(category)
			.expect(201)
			.then(res => {
				expect(res.body._id).toBeTruthy();
				done();
			});
	});
});

describe('GET /tags', () => {
	test('collection should be empty', done => {
		agent
			.get('/categories')
			.expect(200)
			.then(res => {
				expect(res.body).toEqual(expect.arrayContaining([]));
				done();
			});
	});

	test('add a category and get it', async () => {
		await agent
			.post('/categories')
			.send(category)
			.expect(201)
			.then(res => {
				expect(res.body).toBeTruthy();
			});

		return agent
			.get('/categories')
			.expect(200)
			.then(res => {
				expect(res.body).toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							name: category.name
						})
					])
				);
			});
	});
});
