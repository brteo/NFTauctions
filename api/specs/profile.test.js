const supertest = require('supertest');

const app = require('../app');
const db = require('../db/connect-test');
const User = require('../models/user');
const { genereteAuthToken } = require('../helpers/auth');

const agent = supertest.agent(app);

let user;
let userToken;
let user2;
let user3;

beforeAll(async () => await db.connect());
beforeEach(async () => {
	await db.clear();

	user = await new User({
		email: 'user@meblabs.com',
		password: 'testtest',
		account: 'user4321',
		nickname: 'DormiPaglia',
		name: 'John',
		lastname: 'Doe',
		pic: 'pic.jpg',
		header: 'header.jpg',
		bio: 'my bio',
		role: 'user',
		active: 1
	}).save();
	userToken = genereteAuthToken(user).token;

	user2 = await new User({
		email: 'user2@meblabs.com',
		password: 'testtest',
		account: 'usery4321',
		nickname: 'Cicciopasticcio',
		name: 'Alice',
		lastname: 'Keen',
		pic: 'pic.jpg',
		header: 'header.jpg',
		bio: 'my bio 2',
		role: 'user',
		active: 1
	}).save();

	user3 = await new User({
		email: 'user3@meblabs.com',
		password: 'testtest',
		account: 'userx4321',
		nickname: 'Deleted',
		name: 'John',
		lastname: 'Doe',
		pic: 'pic.jpg',
		header: 'header.jpg',
		bio: 'my bio',
		role: 'user',
		active: 1,
		deleted: 1
	}).save();
});
afterEach(() => jest.clearAllMocks());
afterAll(async () => await db.close());

/*
 * User Role
 */
describe('Role: user', () => {
	describe('GET /profile', () => {
		test('Get all should contains three profiles', done => {
			agent
				.get('/profile')
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.expect(200)
				.then(res => {
					expect(res.body.length).toBe(2);
					done();
				});
		});

		test("Get user's profile should be done with correct profile fields", done => {
			agent
				.get('/profile/' + user.id)
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.expect(200)
				.then(res => {
					expect(res.body).toMatchObject({ ...user.response('profile'), _id: user.id });
					done();
				});
		});

		test('Get any specific profile should be done with correct profile fields', done => {
			agent
				.get('/profile/' + user2.id)
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.expect(200)
				.then(res => {
					expect(res.body).toMatchObject({ ...user2.response('profile'), _id: user2.id });
					done();
				});
		});

		test('Get wrong userId should be ValidationError', done => {
			agent
				.get('/profile/1234')
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 200 }));
					done();
				});
		});

		test('Get inexistent userId should be NotFound', done => {
			agent
				.get('/profile/507f1f77bcf86cd799439011')
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
					done();
				});
		});

		test('Get deleted user should be NotFound', () => {
			agent
				.get('/profile/' + user3.id)
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.expect(404)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 404 }));
				});
		});
	});

	describe('PUT /profile', () => {
		test('His own profile should be changed', done => {
			agent
				.put('/profile/' + user.id)
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.send({ bio: 'edit' })
				.expect(200)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ bio: 'edit' }));
					done();
				});
		});

		test('Any other user should be Forbidden', done => {
			agent
				.put('/profile/' + user2.id)
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.send({ bio: 'edit' })
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
					done();
				});
		});

		test('Update wrong userId should be ValidationError', done => {
			agent
				.put('/profile/1234')
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.send({ name: 'edit' })
				.expect(400)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 200 }));
					done();
				});
		});

		test('Update inexistent userId should be Forbidden', done => {
			agent
				.put('/profile/507f1f77bcf86cd799439011')
				.set('Cookie', `TvgAccessToken=${userToken}`)
				.send({ name: 'edit' })
				.expect(403)
				.then(res => {
					expect(res.body).toEqual(expect.objectContaining({ error: 403 }));
					done();
				});
		});
	});
});
