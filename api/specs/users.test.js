/* eslint-disable no-underscore-dangle */
const supertest = require('supertest');
const app = require('../app');
const db = require('../db/connect-test');
const User = require('../models/user');

const agent = supertest.agent(app);

beforeAll(async () => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async () => await db.close());

const user = {
	email: 'matteo@meblabs.com',
	password: 'testtest',
	name: 'Matteo',
	lastname: 'Brocca'
};
const user2 = {
	email: 'alan@meblabs.com',
	password: 'testtest',
	name: 'Matteo',
	lastname: 'Brocca'
};

describe('POST /users', () => {
	test('New user should be added', done => {
		agent
			.post('/users')
			.send(user)
			.expect(201)
			.then(res => {
				expect(res.body._id).toBeTruthy();
				done();
			});
	});
});

describe('GET /users', () => {
	test('collection should be empty', done => {
		agent
			.get('/users')
			.expect(200)
			.then(res => {
				expect(res.body).toEqual(expect.arrayContaining([]));
				done();
			});
	});

	// don't use "done" param if async function
	test('add 1 user and get it', async () => {
		await agent
			.post('/users')
			.send(user)
			.expect(201)
			.then(res => {
				expect(res.body).toBeTruthy();
			});

		return agent
			.get('/users')
			.expect(200)
			.then(res => {
				expect(res.body).toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							email: user.email
						})
					])
				);
			});
	});
});
