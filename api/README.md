# Api

RESTApi main endpoint [http://localhost:5000](http://localhost:5000)

MongoDB at localhost:27017

## NPM Packages

- [espress](https://expressjs.com/it/guide/routing.html)
- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [mongoose](https://mongoosejs.com)
- [ajv](https://ajv.js.org/)
- [jsonwebtoken](https://jwt.io)
- [Passport](http://www.passportjs.org) passport-jwt passport-local

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

## Test

[Setup in-memory database for testing Node.js and Mongoose](https://dev.to/ryuuto829/setup-in-memory-database-for-testing-node-js-and-mongoose-1kop)

## AUTH

1. On login get Token + Refresh Token

- Token is JWT with userID
- The token must have shot lifetime like 1 hour -> parameter (we use 5 minutes)
- Refresh token can have long lifetime like 1 month -> parameter
- The refresh token is saved on DB in a table with its expiry data

- 1 user can have more refresh token

2. Check the token when there is a request that require auth

- Client send token in every rest api request like header -> Authorization: Bearer "token"
- The token is verified by the isAuth middleware
- If the token is invalid response with error status 401 [Unauthorized]

3. Request new token by refresh token + userID

- When client get 401 auth error, it can call /auth/refreshToken to get a new accessToken and refresh the refreshToken
- If the refresh token exists in table => generate new token for userID (delete from table the old one)
- If refresh token does not exist for userID => remove all refresh token and set field auth_reset in user with current timestamp (maybe hack...)
  - auth_reset on user must used by passport middleware to check token

## RBAC

- isAuth middleware to validate the accessToken
- permit middleware to validate, through a json policy linked to the role of the user, that the callee can execute the CRUD on that kind of resurce
- each endpoint checks if the call is legit on that particular resource

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
