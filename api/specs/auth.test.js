const supertest = require('supertest');
const app = require('../app');
const db = require('../db/connect-test');

const agent = supertest.agent(app);

beforeAll(async () => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async () => await db.close());

describe('Logger', () => {
	test.todo('please pass');
});
/* 
describe('GET /auth', () => {
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
 */
