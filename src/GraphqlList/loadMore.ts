import { QueryResult } from '@apollo/client';

import { getQueryVariables } from './getQueryVariables';
import { getUpdateQuery } from './getUpdateQuery';
import { GraphqlListProps, QueryVariables } from './types';

/**
 * Load more data aka load next page
 */
export async function loadMore(result: QueryResult, props: GraphqlListProps) {
	if (!result) {
		return false;
	}

	const { mapQueryResultToConnection, itemsPerPage, page, pagination, queryOptions } = props;
	const connection = mapQueryResultToConnection(result);
	const pageInfo = connection?.pageInfo;
	const endCursor = connection?.pageInfo?.endCursor;

	// Abort if
	if (
		// If we don't have pageInfo
		!pageInfo ||
		// If there are no more pages in infinite scroll mode
		(props.pagination === 'infinite' && !pageInfo.hasNextPage) ||
		// If we are already in processing a query
		result.networkStatus < 7
	) {
		return false;
	}

	// const dataEdges: GraphqlConnectionEdge[] = get(connection, 'edges', []);

	const inputVariables: QueryVariables = {
		before: props.before,
		after: props.after,
		first: props.first,
		last: props.last,
		filter: props.filter,
		orderBy: props.orderBy,
	};

	if (!inputVariables.after && !inputVariables.before) {
		inputVariables.after = endCursor;
	}

	// load more queries starting from the cursor of the last (oldest) message
	const variables = getQueryVariables(inputVariables, queryOptions?.variables, {
		itemsPerPage,
		page,
		pagination,
	});

	try {
		await result.fetchMore({ updateQuery: getUpdateQuery(props), variables });
		return true;
	} catch (error) {
		return false;
	}
}
