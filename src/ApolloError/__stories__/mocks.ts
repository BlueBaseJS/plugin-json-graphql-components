// tslint:disable: max-line-length object-literal-sort-keys
import { HelloWorldQuery } from './Query';

export const networkError = {
	request: {
		query: HelloWorldQuery,
		variables: {},
	},
	result: {
		error: {
			name: 'ServerParseError',
			response: {},
			statusCode: 404,
			bodyText:
				// eslint-disable-next-line max-len
				'<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot POST /graphql</pre>\n</body>\n</html>\n',
		},
	},
};

export const graphQLErrorsUnAuthenticated = {
	request: {
		query: HelloWorldQuery,
		variables: {},
	},
	result: {
		errors: [
			{
				extensions: {
					code: 'UNAUTHENTICATED',
				},
				locations: [],
				message: 'forbidden',
				path: ['protectedAction'],
			},
		],
	},
};

export const graphQLErrorsForbidden = {
	request: {
		query: HelloWorldQuery,
		variables: {},
	},
	result: {
		errors: [
			{
				extensions: {
					code: 'FORBIDDEN',
				},
				locations: [],
				message: 'forbidden',
				path: ['protectedAction'],
			},
		],
	},
};

export const graphQLErrorsNotFound = {
	request: {
		query: HelloWorldQuery,
		variables: {},
	},
	result: {
		errors: [
			{
				extensions: {
					code: 'NOT_FOUND',
				},
				locations: [],
				message: 'Document not found',
				path: ['node'],
			},
		],
	},
};

export const graphQLErrorsBadUserInput = {
	request: {
		query: HelloWorldQuery,
		variables: {},
	},
	result: {
		errors: [
			{
				message: 'Failed to get events due to validation errors',
				extensions: {
					code: 'BAD_USER_INPUT',
					exception: {
						validationErrors: {
							firstName: 'I m sorry, but we dont like your name.',
							password: 'The password cannot be less than 8 characters',
						},
					},
				},
			},
		],
	},
};
