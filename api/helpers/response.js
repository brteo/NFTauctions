const Response = (message, statusCode = 500, data = {}, error = 1) => ({
	message,
	statusCode,
	data,
	error
});

module.exports = {
	/* OK */
	SendData: (data, statusCode = 200) => Response('Success', statusCode, data),

	/* ERRORS */
	CustomError: (message, statusCode, data, error) => Response(message, statusCode, data, error),

	ServerError: data =>
		Response('System error: operation not completed, please refresh the page or try again later', 500, data, 1),

	/* 100 - generic incorrect parameters */

	IncorrectParameter: data => Response('Incorrect parameter', 400, data, 100),

	/* 200 - validation errors */

	ValidationError: data => Response('Validation Error', 400, data, 200),

	IncorrectEmail: data => Response('Incorrect Email', 400, data, 201),

	EmailAlreadyExists: data => Response('The email already exists', 400, data, 202),

	ValueTooShort: data => Response('Value too short', 400, data, 203),

	ValueTooLong: data => Response('Value too long', 400, data, 204),

	InvalidEmail: data => Response('Email not valid', 400, data, 205),

	MediaTypeError: () => Response('Unsupported media type', 415, {}, 215),

	/* 300 - auth errors */

	MissingCredentials: data => Response('Missing credentials', 400, data, 300),

	WrongEmail: data => Response('Wrong email', 400, data, 301),

	WrongPassword: () => Response('Wrong password', 400, {}, 302),

	InactiveAccount: () => Response('Inactive account', 401, {}, 303),

	AlreadyAuthenticated: () => Response('You are already authenticated', 400, {}, 304),

	AuthReset: () => Response('Auth reset, please change password', 401, {}, 305),

	MissingRefreshToken: () => Response('Refresh token does not exist', 401, {}, 306),

	DeletedAccount: () => Response('Deleted account', 400, {}, 307),

	MissingRequiredParameter: () => Response('Missing required parameter', 400, {}, 308),

	AdditionalParameters: () => Response('Additional parameters', 400, {}, 309),

	ExpiredRefreshToken: () => Response('Expired refresh token', 401, {}, 310),

	ExpiredAccessToken: () => Response('Expired access token', 401, {}, 311),

	/* 400 - generic client error */

	BadRequest: () => Response('Bad request', 400, {}, 400),

	Unauthorized: () => Response('Unauthorized', 401, {}, 401),

	BlockedByCORS: () => Response('Not allowed by CORS', 401, {}, 402),

	Forbidden: () => Response('Forbidden', 403, {}, 403),

	NotFound: () => Response('Not found', 404, {}, 404),

	NotAcceptable: () => Response('Not acceptable', 406, {}, 406)
};
