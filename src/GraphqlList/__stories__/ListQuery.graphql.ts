/* istanbul ignore file */
import gql from 'graphql-tag';

export interface ListQueryEdge {
	cursor: string;
	node: {
		id: string;
		value: string;
	};
}

export interface PageInfo {
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor: string;
	endCursor: string;
}

export interface ListQueryData {
	viewer: {
		__typename: string;
		edges: ListQueryEdge[];
		pageInfo: PageInfo;
		// totalCount: number;
	};
}

export const ListQuery = gql`
	query ListQuery($filter: FilterInput!) {
		items(filter: $filter) {
			edges {
				cursor
				node {
					id
					value
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
