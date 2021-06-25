const supertest = require('supertest');
const app = require('../app');
const db = require('../db/connect-test');

const agent = supertest.agent(app);

beforeAll(async () => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async () => await db.close());

describe('GET /', () => {
	test('It should be live', done => {
		agent
			.get('/')
			.expect(200)
			.then(res => {
				expect(res.body.message).toBe('RestAPI is live!');
				done();
			});
	});
});

describe('GET /not_found', () => {
	test('Inexistente routes should be Not Found', done => {
		agent
			.get('/not_found')
			.expect(404)
			.then(res => {
				expect(res.body).toMatchObject({ message: 'Not found', data: {}, error: 404 });
				done();
			});
	});
});
