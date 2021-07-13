# Api

RESTApi main endpoint [http://localhost:5000](http://localhost:5000)

MongoDB at localhost:27017

## NPM Packages

- [espress](https://expressjs.com/it/guide/routing.html)
- [cors](https://www.npmjs.com/package/cors)
- [cookie-parser](http://expressjs.com/en/resources/middleware/cookie-parser.html)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [mongoose](https://mongoosejs.com)
- [ajv](https://ajv.js.org/) [ajv-formats](https://github.com/ajv-validator/ajv-formats)
- [jsonwebtoken](https://jwt.io)
- [Passport](http://www.passportjs.org) passport-jwt passport-local
- [uuid](https://www.npmjs.com/package/uuid)

DEV

- [eslint](https://eslint.org/docs/user-guide/getting-started) eslint-config-airbnb eslint-plugin-import
- [prettier](https://prettier.io/docs/en/index.html) eslint-config-prettier eslint-plugin-prettier
- [jest](https://jestjs.io/docs/getting-started) eslint-plugin-jest
- [supertest](https://www.npmjs.com/package/supertest)
- [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server)
- [dotenv](https://www.npmjs.com/package/dotenv) (for jest test)

## Utilities

- Client MongoDB: [Robo3T](https://robomongo.org)
- Client RESTApi: [Postman](https://www.postman.com)

## Test with MongoDB

[Setup in-memory database for testing Node.js and Mongoose](https://dev.to/ryuuto829/setup-in-memory-database-for-testing-node-js-and-mongoose-1kop)

## MongoDB

- [populate](https://mongoosejs.com/docs/populate.html)
- [data-modeling-introduction/](https://docs.mongodb.com/manual/core/data-modeling-introduction/)
- [mongodb-relationships-embed-or-reference](https://stackoverflow.com/questions/5373198/mongodb-relationships-embed-or-reference)

## AUTH

On login client send credentials to endpoint `/auth/login`.<br>
Passport use local strategy and if correct the client get Auth Token + Refresh Token.

- Auth Token is JWT with userID,
  - Payload with userID
  - Shot lifetime like 5 minute.
- Refresh token is UUID V1 (timestamp)
  - have long lifetime like 30 days
  - saved on DB in a table with its expiry data
  - sent to client as payload on other JWT with userID
  - one user can have more refresh token (different devices)

Any Route that need authorization need a middleware where Passport check JWT validate.<br>
The JWT is set as [cookie http-only](https://medium.com/@sadnub/simple-and-secure-api-authentication-for-spas-e46bcea592ad).<br>
If the Auth Token is not valid the response is `401 [Unauthorized, 401]`

```js
router.route('/').get(isAuth, controller.get);
```

The client can get new Auth Token with Refresh Token with endpoint `/auth/rt`<br>
The Refresh token is inside JWT payload as "rt" and set as [cookie http-only](https://medium.com/@sadnub/simple-and-secure-api-authentication-for-spas-e46bcea592ad).<br>
Passport check if JWT is validate and check if Refresh Token exist on DB for the userID

- If JWT is not valid the response is `401 [Unauthorized, 401]`
- If Refresh Token is expired the response is `401 [Expired refresh token, 310]`
- If Refresh Token does not exis the response is `401 [Refresh token does not exist, 306]` (maybe hack...)<br>
  In this case the client maybe hack: will remove all generetated refresh token for user and set authReset with current timestamp.<br>
  From now this user can't access, not even with valit auth token.<br>
  Will request to client to change the password

## RBAC

Any user can have `role` line "user" or "admin".
When user are logged, Passport load his grants from json file

```json
/* admin role */
{
	"users": { // resources
		"create:any": ["*"],
		"read:any": ["*"],
		"update:any": ["*"],
		"delete:any": ["*"]
	}
}

/* user role */
{
	"users": {
		"read:own": ["*"],
		"update:own": ["*","!active"] // cant change active field
	}
}
```

The permit file are Json Object where for each resources (like "users") can have CRUD grants with "any" or "own" and optionals attributes.

Any Route that need RACB need a middleware that validate.<br>
If the client can't have grants for the routes, the response is `403 [Forbidden, 403]`

```js
router.route('/').get(isAuth, rbac('users', 'read:any'), controller.get);
```

If you want to check "any" or "own" inside controllers

```js
// route.js
router.route('/:id').get(isAuth, rbac('users', 'read'), controller.getByID);

// controller.js
exports.getById = (req, res, next) => {
	if (res.locals.grants.type !== 'any' && res.locals.user.id !== req.params.id) return next(Forbidden());

	return User.findById(req.params.id, (err, user) => {
		// ...
	});
};
```

## Soft Delete Schema Plugin

If you need soft delate on model

```js
const softDelete = require('../helpers/softDelete');
const { Schema } = mongoose;

const schema = Schema({
	// schema
});
schema.plugin(softDelete);
```

With soft delete the model schema have automatically `deleted: boolean` and `deletedAt: Date` fields.<br>
All find query hava a middleware that exclude deleted resource:

- count
- find
- findOne
- findOneAndDelete
- findOneAndRemove
- findOneAndUpdate
- update
- updateOne
- updateMany

To soft delete a resource:

```js
user.softdelete();
```

## Public fields inside Model Schema

```js
const PUBLIC_FIELDS = ['_id', 'email', 'name', 'lastname', 'birthdate', 'role'];

schema.methods.getPublicFields = function () {
	return PUBLIC_FIELDS.reduce((acc, item) => {
		acc[item] = this[item];
		return acc;
	}, {});
};

schema.pre(['find'], function (next) {
	if (!this.selected()) this.select(PUBLIC_FIELDS);
	return next();
});
```

## Schema validation

The schema validation are saved like `js` in schema folder and loaded all when server startup.

```js
module.exports = {
	auth: {
		$id: 'auth',
		type: 'object',
		properties: {
			email: { type: 'string', format: 'email' },
			password: { type: 'string' }
		},
		additionalProperties: false
	},
	loginAuth: {
		type: 'object',
		allOf: [{ $ref: 'auth' }],
		required: ['email', 'password']
	},
	emailAuth: {
		type: 'object',
		allOf: [{ $ref: 'auth' }],
		required: ['email']
	},
	registerAuth: {
		type: 'object',
		allOf: [{ $ref: 'auth' }],
		required: ['email', 'password']
	}
};
```

To valid req.body with schema name use a middleware inside routes:

```js
router.post('/login', validator('loginAuth'), login);
```

To valid req.params or more pass an object to middleware:

- key = the source in express req
- value = schema name

```js
router.get('/email/:email?', validator({ params: 'emailAuth' }), checkIfEmailExists);
```

## REST

1. **Client–server** – By separating the user interface concerns from the data storage concerns, we improve the portability of the user interface across multiple platforms and improve scalability by simplifying the server components.
2. **Stateless** – Each request from client to server must contain all of the information necessary to understand the request, and cannot take advantage of any stored context on the server. Session state is therefore kept entirely on the client.
3. **Cacheable** – Cache constraints require that the data within a response to a request be implicitly or explicitly labeled as cacheable or non-cacheable. If a response is cacheable, then a client cache is given the right to reuse that response data for later, equivalent requests.
4. **Uniform interface** – By applying the software engineering principle of generality to the component interface, the overall system architecture is simplified and the visibility of interactions is improved. In order to obtain a uniform interface, multiple architectural constraints are needed to guide the behavior of components. REST is defined by four interface constraints: identification of resources; manipulation of resources through representations; self-descriptive messages; and, hypermedia as the engine of application state.
5. **Layered system** – The layered system style allows an architecture to be composed of hierarchical layers by constraining component behavior such that each component cannot “see” beyond the immediate layer with which they are interacting.
6. **Code on demand (optional)** – REST allows client functionality to be extended by downloading and executing code in the form of applets or scripts. This simplifies clients by reducing the number of features required to be pre-implemented.

#### Method

| Method | CRUD                 | ENTIRE COLLECTION (E.G. /USERS)                                                                 | SPECIFIC ITEM (E.G. /USERS/123)                                                |
| ------ | -------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| POST   | Create               | 201 (Created), ‘Location’ header with link to /users/{id} containing new ID.                    | Avoid using POST on single resource                                            |
| GET    | Read                 | 200 (OK), list of users. Use pagination, sorting and filtering to navigate big lists.           | 200 (OK), single user. 404 (Not Found), if ID not found or invalid.            |
| PUT    | Update/Replace       | 404 (Not Found), unless you want to update every resource in the entire collection of resource. | 200 (OK) or 204 (No Content). Use 404 (Not Found), if ID not found or invalid. |
| PATCH  | PartialUpdate/Modify | 404 (Not Found), unless you want to modify the collection itself.                               | 200 (OK) or 204 (No Content). Use 404 (Not Found), if ID not found or invalid. |
| DELETE | Delete               | 404 (Not Found), unless you want to delete the whole collection — use with caution.             | 200 (OK). 404 (Not Found), if ID not found or invalid.                         |

#### POST vs PUT

```
GET 	/device-management/devices : Get all devices
POST 	/device-management/devices : Create a new device
```

```
GET 	/device-management/devices/{id} : Get the device information identified by "id"
PUT 	/device-management/devices/{id} : Update the device information identified by "id"
DELETE	/device-management/devices/{id} : Delete device by "id"
```

#### HTTP status code

- **1xx**: Informational Communicates transfer protocol-level information.
- **2xx**: Success Indicates that the client’s request was accepted successfully.
- **3xx**: Redirection Indicates that the client must take some additional action in order to complete their request.
- **4xx**: Client Error This category of error status codes points the finger at clients.
- **5xx**: Server Error The server takes responsibility for these error status codes.

[Details](https://restfulapi.net/http-status-codes/)
