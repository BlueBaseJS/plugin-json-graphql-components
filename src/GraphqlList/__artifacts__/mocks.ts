/* istanbul ignore file */
// tslint:disable: max-line-length object-literal-sort-keys
import faker from '@faker-js/faker';

import { ProductListQuery } from './ProductListQuery.graphql';

/**
 *
 * @param items Items to create
 * @param cursorIndex Starting index
 * @param totalCount Total number of items
 */

const createFakeData = (items: number, cursorIndex: number, totalCount: number) => {
	const edges = [];

	for (let index = 0; index < items; index++) {
		const finalCursor = cursorIndex + index;

		if (finalCursor >= totalCount) {
			break;
		}

		const hasAvatar = faker.datatype.boolean();

		edges.push({
			cursor: finalCursor,
			node: {
				id: faker.datatype.uuid(),
				name: faker.lorem.sentence(faker.datatype.number({ min: 2, max: 10 })),

				avatar: hasAvatar ? faker.image.city(300, 300) : null,
				thumbnail: hasAvatar ? faker.image.city(5, 5) : null,

				brand: {
					name: `Brand ${finalCursor}`,
					// name: faker.lorem.word(),
				},
			},
		});
	}

	const lastCursor = cursorIndex + items;

	const pageInfo = {
		hasNextPage: lastCursor < totalCount,
		hasPreviousPage: cursorIndex !== 0,
		startCursor: edges.length > 0 ? edges[0].cursor : null,

		endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
	};

	return {
		products: {
			edges,
			pageInfo,
			totalCount,
		},
	};
};

export const ProductListQueryMocks = {
	successInfinite: (avatarSize = 142) => [
		{
			request: {
				query: ProductListQuery,
				variables: {
					avatarSize,
					filter: {
						first: 10,
					},
				},
			},
			result: {
				data: createFakeData(10, 0, 32),
			},
		},
		{
			request: {
				query: ProductListQuery,
				variables: {
					avatarSize,
					filter: {
						after: 9,
						first: 10,
					},
				},
			},
			result: {
				data: createFakeData(10, 9, 32),
			},
		},
		{
			request: {
				query: ProductListQuery,
				variables: {
					avatarSize,
					filter: {
						after: 18,
						first: 10,
					},
				},
			},
			result: {
				data: createFakeData(10, 18, 32),
			},
		},
		{
			request: {
				query: ProductListQuery,
				variables: {
					avatarSize,
					filter: {
						after: 27,
						first: 10,
					},
				},
			},
			result: {
				data: createFakeData(10, 27, 32),
			},
		},
	],

	successNumbered: (avatarSize = 142) => [
		{
			request: {
				query: ProductListQuery,
				variables: {
					avatarSize,
					filter: {
						limit: 10,
						offset: 0,
					},
				},
			},
			result: {
				data: createFakeData(10, 0, 32),
			},
		},
		{
			request: {
				query: ProductListQuery,
				variables: {
					avatarSize,
					filter: {
						offset: 10,
						limit: 10,
					},
				},
			},
			result: {
				data: createFakeData(10, 9, 32),
			},
		},
		{
			request: {
				query: ProductListQuery,
				variables: {
					avatarSize,
					filter: {
						offset: 20,
						limit: 10,
					},
				},
			},
			result: {
				data: createFakeData(10, 18, 32),
			},
		},
		{
			request: {
				query: ProductListQuery,
				variables: {
					avatarSize,
					filter: {
						offset: 30,
						limit: 10,
					},
				},
			},
			result: {
				data: createFakeData(10, 27, 32),
			},
		},
	],

	success: (avatarSize = 142) => [
		...ProductListQueryMocks.successInfinite(avatarSize),
		...ProductListQueryMocks.successNumbered(avatarSize),
	],

	successLight: (avatarSize = 142) => [
		{
			request: {
				query: ProductListQuery,
				variables: {
					avatarSize,
					filter: {
						first: 10,
					},
				},
			},
			result: {
				data: createFakeData(8, 0, 8),
			},
		},
	],

	successOffset: (avatarSize = 142) => [
		{
			request: {
				query: ProductListQuery,
				variables: {
					avatarSize,
					filter: {
						offset: 0,
						limit: 10,
					},
				},
			},
			result: {
				data: createFakeData(10, 1, 52),
			},
		},
		{
			request: {
				query: ProductListQuery,
				variables: {
					avatarSize,
					filter: {
						offset: 10,
						limit: 10,
					},
				},
			},
			result: {
				data: createFakeData(10, 11, 52),
			},
		},
		{
			request: {
				query: ProductListQuery,
				variables: {
					avatarSize,
					filter: {
						offset: 20,
						limit: 10,
					},
				},
			},
			result: {
				data: createFakeData(10, 21, 52),
			},
		},
		{
			request: {
				query: ProductListQuery,
				variables: {
					avatarSize,
					filter: {
						offset: 30,
						limit: 10,
					},
				},
			},
			result: {
				data: createFakeData(10, 31, 52),
			},
		},
		{
			request: {
				query: ProductListQuery,
				variables: {
					avatarSize,
					filter: {
						offset: 40,
						limit: 10,
					},
				},
			},
			result: {
				data: createFakeData(10, 41, 52),
			},
		},
		{
			request: {
				query: ProductListQuery,
				variables: {
					avatarSize,
					filter: {
						offset: 50,
						limit: 10,
					},
				},
			},
			result: {
				data: createFakeData(10, 51, 52),
			},
		},
	],

	empty: (avatarSize = 142) => [
		{
			request: {
				query: ProductListQuery,
				variables: {
					avatarSize,
					filter: {
						first: 10,
					},
				},
			},
			result: {
				data: createFakeData(0, 0, 0),
			},
		},
	],

	networkError: {
		request: {
			query: ProductListQuery,
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
	},

	graphQLErrorsUnAuthenticated: {
		request: {
			query: ProductListQuery,
			variables: {
				avatarSize: 142,
				filter: {
					first: 10,
				},
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
	},

	graphQLErrorsForbidden: {
		request: {
			query: ProductListQuery,
			variables: {
				avatarSize: 142,
				filter: {
					first: 10,
				},
			},
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
	},

	graphQLErrorsBadUserInput: {
		request: {
			query: ProductListQuery,
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
	},
};
