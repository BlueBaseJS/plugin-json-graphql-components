import { ViewerQuery } from './EditProfileProfileForm';
import { SignupMutation } from './SignupForm';

// tslint:disable: max-line-length object-literal-sort-keys

export const networkError = {
	request: {
		query: SignupMutation,
		variables: {
			email: 'asd@as.cd',
			firstName: 'im only',
			lastName: 'testing',
			password: 'abc',
		},
	},
	result: {
		error: {
			name: 'ServerParseError',
			response: {},
			statusCode: 402,
			bodyText: `<!DOCTYPE html>\n<html lang="en">\n
				<head>\n<meta charset="utf-8">\n
				<title>Error</title>\n</head>\n
				<body>\n<pre>Cannot POST /graphql</pre>\n</body>\n</html>\n`,
		},
	},
};

export const graphQLErrorsUnAuthenticated = {
	request: {
		query: SignupMutation,
		variables: {
			email: 'asd@as.cd',
			firstName: 'im only',
			lastName: 'testing',
			password: 'abc',
		},
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

export const graphQLErrorsBadUserInput = {
	request: {
		query: SignupMutation,
		variables: {
			email: 'asd@as.cd',
			firstName: 'im only',
			lastName: 'testing',
			password: 'abc',
		},
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

export const success = {
	request: {
		query: SignupMutation,
		variables: {
			email: 'asd@as.cd',
			firstName: 'im only',
			lastName: 'testing',
			password: 'abc',
		},
	},
	result: {
		data: {
			signup: {
				id: '5ccec1e892b8486b652aa670',
				email: 'asd@as.cd',
				firstName: 'im only',
				lastName: 'testing',
				password: 'abc',
				accessToken: '',
			},
		},
	},
};

export const viewerQuery = {
	request: {
		query: ViewerQuery,
	},
	result: {
		data: {
			viewer: {
				me: {
					id: '5ccec1e892b8486b652aa670',
					firstName: 'Abdul Rehman',
					lastName: 'Talat',
				},
			},
		},
	},
};

export const viewerQuery1 = {
	request: {
		query: ViewerQuery,
	},
	result: {
		data: {
			viewer: {
				me: {
					id: '1',
					firstName: 'Abdul',
					lastName: '3',
				},
			},
		},
	},
};
