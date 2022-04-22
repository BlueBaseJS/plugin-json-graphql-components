/* istanbul ignore file */

import { FetchMoreOptions } from '@apollo/client';
import gql from 'graphql-tag';
import get from 'lodash.get';

export const ProductListQuery = gql`
	query ProductListQuery($filter: FilterInput!, $avatarSize: Int!) {
		products(filter: $filter) {
			edges {
				cursor
				node {
					id
					name
					avatar(input: { width: $avatarSize, height: $avatarSize })
					thumbnail: avatar(input: { width: 5, height: 5 })
					brand {
						name
					}
				}
			}
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
			}
			totalCount
		}
	}
`;

export const ProductListQueryUpdateQueryFn: FetchMoreOptions['updateQuery'] = (
	previousResult,
	{ fetchMoreResult }
) => {
	if (!fetchMoreResult) {
		return previousResult;
	}

	const prevEdges = get(previousResult, 'products.edges', []);
	const newEdges = get(fetchMoreResult, 'products.edges', []);

	if (newEdges.length) {
		return {
			// Put the new items at the end of the list and update `pageInfo`
			// so we have the new `endCursor` and `hasNextPage` values
			products: {
				...get(previousResult, 'products', undefined),

				edges: [...prevEdges, ...newEdges],
				pageInfo: {
					...get(previousResult, 'products.pageInfo'),

					endCursor: get(fetchMoreResult, 'products.pageInfo.endCursor'),
					hasNextPage: get(fetchMoreResult, 'products.pageInfo.hasNextPage'),

					hasPreviousPage: get(previousResult, 'products.pageInfo.hasPreviousPage'),
					startCursor: get(previousResult, 'products.pageInfo.startCursor'),
				},
			},
		};
	}

	return previousResult;
};
