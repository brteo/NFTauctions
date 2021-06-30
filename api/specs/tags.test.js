const supertest = require('supertest');

const app = require('../app');
const db = require('../db/connect-test');

const agent = supertest.agent(app);

beforeAll(async () => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async () => await db.close());

const tag = {
	name: 'file'
};

describe('POST /tags', () => {
	test('New tag should be added', done => {
		agent
			.post('/tags')
			.send(tag)
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
			.get('/tags')
			.expect(200)
			.then(res => {
				expect(res.body).toEqual(expect.arrayContaining([]));
				done();
			});
	});

	// don't use "done" param if async function
	test('add 1 user and get it', async () => {
		await agent
			.post('/tags')
			.send(tag)
			.expect(201)
			.then(res => {
				expect(res.body).toBeTruthy();
			});

		return agent
			.get('/tags')
			.expect(200)
			.then(res => {
				expect(res.body).toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							name: tag.name
						})
					])
				);
			});
	});
});
